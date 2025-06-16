import moment from 'moment';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import models from "../models/index.js";
import { processPunch } from '../utils/punchProcessor.js';

const { Attendance, AttendanceSetting, EmployeeShiftSchedule } = models;

const markNewAttendance = async (req, res) => {
  try {
    const { employeeId, punchDatetime } = req.body;
    console.log('[Request] employeeId:', employeeId, 'punchDatetime:', punchDatetime);

    if (!employeeId || !punchDatetime) {
      console.log('[Validation Failed] Missing employeeId or punchDatetime');
      return res.status(400).json({ message: 'Employee ID and punch time are required.' });
    }

    let date = moment(punchDatetime).format('YYYY-MM-DD');
    const time = moment(punchDatetime).format('HH:mm:ss');
    const punchMoment = moment(punchDatetime);
    console.log('[Parsed Date/Time] date:', date, 'time:', time);

    let shiftSchedule;
    let isPreviousDayUsed = false;

    // 1. Try to fetch today's shift
    shiftSchedule = await EmployeeShiftSchedule.findOne({
      where: { userId: employeeId, date },
      include: [AttendanceSetting],
    });
    console.log('[ShiftSchedule] fetched for date:', date, !!shiftSchedule);

    // 2. If no shift found, check if it's a punch-out for previous day
    if (!shiftSchedule) {
      const previousDate = moment(date).subtract(1, 'day').format('YYYY-MM-DD');
      console.log('[No shift today] Checking previous date:', previousDate);

      const yesterdayAttendance = await Attendance.findOne({
        where: { employeeId, date: previousDate },
      });
      console.log('[Yesterday Attendance] found:', !!yesterdayAttendance);

      if (yesterdayAttendance && !yesterdayAttendance.checkOut) {
        shiftSchedule = await EmployeeShiftSchedule.findOne({
          where: { userId: employeeId, date: previousDate },
          include: [AttendanceSetting],
        });
        console.log('[ShiftSchedule] fetched for previousDate:', previousDate, !!shiftSchedule);

        if (shiftSchedule) {
          date = previousDate;
          isPreviousDayUsed = true;
          console.log('[Using Previous Day Shift] date updated to:', date);
        }
      }
    }

    const setting = shiftSchedule?.AttendanceSetting;
    const shiftStart = setting ? moment(`${date} ${setting.checkInTime}`) : null;
    let shiftEnd = setting ? moment(`${date} ${setting.checkOutTime}`) : null;
    console.log('[Shift Timing] start:', shiftStart?.format(), 'end:', shiftEnd?.format());

    if (shiftEnd && shiftStart && shiftEnd.isBefore(shiftStart)) {
      shiftEnd.add(1, 'day'); // Overnight shift
      console.log('[Overnight Shift] Adjusted shiftEnd:', shiftEnd.format());
    }

    const graceCheckIn = shiftStart?.clone().add(setting?.gracePeriodMinutes || 0, 'minutes');
    const earlyLeaveCutoff = shiftEnd?.clone().subtract(setting?.earlyLeaveAllowanceMinutes || 0, 'minutes');
    console.log('[Grace and Early Leave Cutoff] graceCheckIn:', graceCheckIn?.format(), 'earlyLeaveCutoff:', earlyLeaveCutoff?.format());

    // 3. Check attendance record for this date
    let attendance = await Attendance.findOne({ where: { employeeId, date } });
    console.log('[Attendance Record] found:', !!attendance);

    if (!attendance) {
      // First punch (check-in)
      const isLate = shiftStart ? punchMoment.isAfter(graceCheckIn) : false;
      console.log('[Check-in] isLate:', isLate);

      attendance = await Attendance.create({
        employeeId,
        date,
        checkIn: time,
        isLate,
        status: shiftSchedule ? 'Present' : 'Unscheduled',
      });
      console.log('[Attendance Created] id:', attendance.id);
    } else {
      // Already has attendance – update punch-out
      const actualIn = moment(`${date} ${attendance.checkIn}`);
      let actualOut = punchMoment.clone();

      console.log('[Existing Attendance] checkIn:', actualIn.format(), 'New Punch:', actualOut.format());

      if (actualOut.isBefore(actualIn)) {
        actualOut.add(1, 'day'); // Handle overnight checkout
        console.log('[Overnight checkout] adjusted actualOut:', actualOut.format());
      }

      let effectiveOut = shiftEnd && actualOut.isAfter(shiftEnd) ? shiftEnd.clone() : actualOut.clone();

      const workedHours = moment.duration(effectiveOut.diff(actualIn)).asHours();
      const overtime = shiftEnd && actualOut.isAfter(shiftEnd)
        ? moment.duration(actualOut.diff(shiftEnd)).asHours()
        : 0;

      const leftEarly = earlyLeaveCutoff ? actualOut.isBefore(earlyLeaveCutoff) : false;
      const shiftDuration = shiftStart && shiftEnd
        ? moment.duration(shiftEnd.diff(shiftStart)).asHours()
        : 0;
      const isHalfDay = shiftDuration > 0 ? workedHours < shiftDuration * 0.5 : false;

      console.log('[Punch-out Calculations] workedHours:', workedHours.toFixed(2), 'overtime:', overtime.toFixed(2), 'leftEarly:', leftEarly, 'isHalfDay:', isHalfDay);

      attendance.checkOut = time;
      attendance.isEarlyLeave = leftEarly;
      attendance.workingHours = parseFloat(workedHours.toFixed(2));
      attendance.overtimeHours = parseFloat(overtime.toFixed(2));

      if (isHalfDay) {
        attendance.status = 'Half-Day';
      } else if (attendance.status === 'Half-Day' && !leftEarly && !attendance.isLate) {
        attendance.status = 'Present';
      }

      await attendance.save();
      console.log('[Attendance Updated] id:', attendance.id, 'status:', attendance.status);
    }

    return res.status(200).json({
      message: isPreviousDayUsed
        ? 'Punch-out updated for previous day.'
        : attendance.checkOut
          ? 'Punch-out updated successfully.'
          : 'Check-in marked successfully.',
      attendance,
    });

  } catch (error) {
    console.error('Error in markNewAttendance:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};





const uploadAttendanceFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.csv', '.xls', '.xlsx'].includes(ext)) {
      return res.status(400).json({ message: 'Unsupported file format.' });
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet); // converts to array of objects

    const results = [];

    for (const row of rows) {
      const employeeId = row.employeeId || row['Employee ID'];
      const punchDatetime = row.punchDatetime || row['Punch Time'];

      if (!employeeId || !punchDatetime) {
        results.push({ employeeId, message: 'Missing required fields', success: false });
        continue;
      }

      const result = await processPunch(employeeId, punchDatetime);
      results.push(result);
    }

    return res.status(200).json({ message: 'File processed.', results });
  } catch (err) {
    console.error('Error in uploadAttendanceFile:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export { markNewAttendance , uploadAttendanceFile};
