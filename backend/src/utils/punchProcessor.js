import moment from 'moment';
import models from "../models/index.js";

const { Attendance, AttendanceSetting, EmployeeShiftSchedule } = models;

export const processPunch = async (employeeId, punchDatetime) => {
  try {
    if (!employeeId || !punchDatetime) {
      return { success: false, message: 'Employee ID and punch time are required.' };
    }

    let date = moment(punchDatetime).format('YYYY-MM-DD');
    const time = moment(punchDatetime).format('HH:mm:ss');
    const punchMoment = moment(punchDatetime);
    let shiftSchedule;
    let isPreviousDayUsed = false;

    // 1. Try to fetch today's shift
    shiftSchedule = await EmployeeShiftSchedule.findOne({
      where: { userId: employeeId, date },
      include: [AttendanceSetting],
    });

    // 2. If no shift found, check if it's a punch-out for previous day
    if (!shiftSchedule) {
      const previousDate = moment(date).subtract(1, 'day').format('YYYY-MM-DD');

      const yesterdayAttendance = await Attendance.findOne({
        where: { employeeId, date: previousDate },
      });

      if (yesterdayAttendance && !yesterdayAttendance.checkOut) {
        shiftSchedule = await EmployeeShiftSchedule.findOne({
          where: { userId: employeeId, date: previousDate },
          include: [AttendanceSetting],
        });

        if (shiftSchedule) {
          date = previousDate;
          isPreviousDayUsed = true;
        }
      }
    }

    const setting = shiftSchedule?.AttendanceSetting;
    const shiftStart = setting ? moment(`${date} ${setting.checkInTime}`) : null;
    let shiftEnd = setting ? moment(`${date} ${setting.checkOutTime}`) : null;

    if (shiftEnd && shiftStart && shiftEnd.isBefore(shiftStart)) {
      shiftEnd.add(1, 'day'); // Overnight shift
    }

    const graceCheckIn = shiftStart?.clone().add(setting?.gracePeriodMinutes || 0, 'minutes');
    const earlyLeaveCutoff = shiftEnd?.clone().subtract(setting?.earlyLeaveAllowanceMinutes || 0, 'minutes');

    // 3. Check attendance record for this date
    let attendance = await Attendance.findOne({ where: { employeeId, date } });

    if (!attendance) {
      // First punch (check-in)
      const isLate = shiftStart ? punchMoment.isAfter(graceCheckIn) : false;

      attendance = await Attendance.create({
        employeeId,
        date,
        checkIn: time,
        isLate,
        status: shiftSchedule ? 'Present' : 'Unscheduled',
      });

    } else {
      // Already has attendance – update punch-out
      const actualIn = moment(`${date} ${attendance.checkIn}`);
      let actualOut = punchMoment.clone();

      if (actualOut.isBefore(actualIn)) {
        actualOut.add(1, 'day'); // Handle overnight checkout
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
    }

    return {
      success: true,
      message: isPreviousDayUsed
        ? 'Punch-out updated for previous day.'
        : attendance.checkOut
          ? 'Punch-out updated successfully.'
          : 'Check-in marked successfully.',
      attendance,
    };

  } catch (error) {
    console.error('Error in processPunch:', error);
    return { success: false, message: 'Internal Server Error', error: error.message };
  }
};
