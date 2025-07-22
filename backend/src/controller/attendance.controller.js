import moment from 'moment';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import models from "../models/index.js";
import { processPunch } from '../utils/punchProcessor.js';
import { getAttendanceSummary } from '../utils/GetAttendanceSummary.js';
import { getAttendanceLogs } from '../utils/getAttendanceLogs.js';

const { Attendance, AttendanceSetting, User, EmployeeShiftSchedule } = models;

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

      let initialStatus = 'Absent';
      if (shiftSchedule) {
        // Use shift duration to decide Half-Day or Absent
        const shiftDuration = shiftStart && shiftEnd
          ? moment.duration(shiftEnd.diff(shiftStart)).asHours()
          : 0;

        if (shiftDuration > 0) {
          initialStatus = 'Half-Day';
        }
      } else {
        // No shift - treat unscheduled as Half-Day initially
        initialStatus = 'Half-Day';
      }
      attendance = await Attendance.create({
        employeeId,
        date,
        checkIn: time,
        isLate,
        status: initialStatus,
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
      let shiftDuration = 0;
      if (shiftStart && shiftEnd) {
        shiftDuration = moment.duration(shiftEnd.diff(shiftStart)).asHours();
      }

      let isHalfDay = false;
      if (shiftDuration > 0) {
        isHalfDay = workedHours < shiftDuration * 0.5;
      }


      console.log('[Punch-out Calculations] workedHours:', workedHours.toFixed(2), 'overtime:', overtime.toFixed(2), 'leftEarly:', leftEarly, 'isHalfDay:', isHalfDay);

      attendance.checkOut = time;
      attendance.isEarlyLeave = leftEarly;
      attendance.workingHours = parseFloat(workedHours.toFixed(2));
      attendance.overtimeHours = parseFloat(overtime.toFixed(2));

      // Apply new status logic
      if (shiftSchedule) {
        // Scheduled Shift
        if (isHalfDay) {
          attendance.status = 'Half-Day';
        } else {
          attendance.status = 'Present';
        }
      } else {
        // Unscheduled Shift (no shiftSchedule)
        if (shiftDuration > 0) {
          if (workedHours < shiftDuration * 0.5) {
            attendance.status = 'Half-Day';
          } else {
            attendance.status = 'Present';
          }
        } else {
          // If even shift timings are not available, fallback to time-based threshold
          attendance.status = workedHours >= 4 ? 'Present' : 'Half-Day';
        }
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





const uploadAttendanceExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const errors = [];
    const validData = [];

    for (let [index, row] of jsonData.entries()) {
      const rowIndex = index + 2; // considering header row is 1

      const {
        employeeId,
        date,
        checkIn,
        checkOut,
        status,
        isLate,
        isEarlyLeave,
        remarks
      } = row;

      let error = { Row: rowIndex };
      let hasError = false;

      // Validate employeeId
      if (!employeeId || typeof employeeId !== 'number') {
        error.EmployeeId = 'Invalid or missing employeeId';
        hasError = true;
      } else {
        const user = await User.findOne({ where: { id: employeeId, companyId: req.user.companyId } });
        if (!user) {
          error.EmployeeId = 'Employee does not belong to company';
          hasError = true;
        }
      }

      // Validate date
      if (!date || isNaN(Date.parse(date))) {
        error.Date = 'Invalid or missing date';
        hasError = true;
      }

      // Either (checkIn + checkOut) or status must be present
      if ((!checkIn || !checkOut) && !status) {
        error.Attendance = 'Either checkIn/checkOut or status is required';
        hasError = true;
      }

      // Validate status if present
      const allowedStatus = ['Present', 'Unscheduled', 'Absent', 'Half-Day', 'Leave'];
      if (status && !allowedStatus.includes(status)) {
        error.Status = 'Invalid status';
        hasError = true;
      }

      if (hasError) {
        errors.push(error);
      } else {
        let workingHours = 0;

        if (checkIn && checkOut) {
          const inTime = new Date(`1970-01-01T${checkIn}`);
          const outTime = new Date(`1970-01-01T${checkOut}`);
          const diffMs = outTime - inTime;
          workingHours = diffMs > 0 ? Math.round(diffMs / (1000 * 60 * 60) * 100) / 100 : 0; // rounded to 2 decimals
        } else if (status === 'Present') {
          workingHours = 8;
        } else if (status === 'Half-Day') {
          workingHours = 4;
        }

        validData.push({
          employeeId,
          date,
          checkIn: checkIn || null,
          checkOut: checkOut || null,
          status: status || 'Present',
          isLate: Boolean(isLate),
          isEarlyLeave: Boolean(isEarlyLeave),
          remarks: remarks || null,
          workingHours
        });

      }
    }

    // If errors found, return Excel file with errors
    if (errors.length > 0) {
      const errorWorkbook = new ExcelJS.Workbook();
      const errorSheet = errorWorkbook.addWorksheet('Errors');

      const headers = Object.keys(errors[0]);
      errorSheet.addRow(headers);
      errors.forEach(err => errorSheet.addRow(headers.map(h => err[h] || '')));

      const errorFilePath = path.join(__dirname, '../../uploads', 'attendance_upload_errors.xlsx');
      await errorWorkbook.xlsx.writeFile(errorFilePath);

      res.setHeader('Content-Disposition', 'attachment; filename=attendance_upload_errors.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(fs.readFileSync(errorFilePath));
    }

    // Save valid records
    for (const data of validData) {
      await Attendance.upsert({ ...data });
    }

    res.status(200).json({ message: 'Attendance uploaded successfully', saved: validData.length });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error while uploading attendance' });
  }
};


const getCompanyAttendanceByDate = async (req, res) => {
  try {
    const { companyId, date } = req.params;

    if (!companyId || !date) {
      return res.status(400).json({ message: 'companyId and date are required in the URL.' });
    }

    const attendanceList = await Attendance.findAll({
      where: { date },
      include: [
        {
          model: User,
          where: { companyId },
          attributes: [], // don't return User fields
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'], // optional: exclude timestamps
      },
      order: [['checkIn', 'ASC']],
    });

    console.log(companyId, date);
    console.log(attendanceList);



    res.status(200).json(attendanceList);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserAttendanceSummaryOFUserByStartEndDateAndUserID = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const summary = await getAttendanceSummary(userId, startDate, endDate);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserAttendanceLogsByStartEndDate = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }

    const logs = await getAttendanceLogs(userId, startDate, endDate);

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getUsersAttendancePerDay = async (req, res) => {
  try {
    const { userId, date } = req.params;

    const attendanceList = await Attendance.findAll({
      where: { date },
      include: [
        {
          model: User,
          where: { id: userId }, // or use 'userId' if your FK is named like that
          attributes: [],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    return res.status(200).json(attendanceList);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({
      message: 'Failed to fetch attendance data',
      error: error.message,
    });
  }
};



export { getUsersAttendancePerDay,markNewAttendance, uploadAttendanceExcel, getCompanyAttendanceByDate, getUserAttendanceSummaryOFUserByStartEndDateAndUserID, getUserAttendanceLogsByStartEndDate };
