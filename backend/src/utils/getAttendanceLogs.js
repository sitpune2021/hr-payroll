import { Op } from 'sequelize';
import models from '../models/index.js';

const {
    User,
    LeaveTemplate,
    WeeklyOffPattern,
    Holiday,
    Attendance,
    LeaveRecord,
} = models;

export const getAttendanceLogs = async (userId, startDate, endDate) => {
  console.log('Fetching attendance logs for:', { userId, startDate, endDate });

  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  let weeklyOffs = [];
  let holidayDates = [];

  if (user.leaveTemplateId) {
    const leaveTemplate = await LeaveTemplate.findByPk(user.leaveTemplateId);

    if (leaveTemplate) {
      weeklyOffs = await WeeklyOffPattern.findAll({
        where: {
          leaveTemplateId: leaveTemplate.id,
          isActive: true,
        },
      });

      const holidays = await Holiday.findAll({
        where: {
          holidayGroupId: leaveTemplate.holidayGroupId,
          holidayDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      holidayDates = holidays.map(h => h.holidayDate.toISOString().split('T')[0]);
    } else {
      console.log(`User ${userId} has leaveTemplateId=${user.leaveTemplateId}, but template not found. Ignoring.`);
    }
  } else {
    console.log(`User ${userId} does not have a leaveTemplateId. Skipping weekly offs and holidays.`);
  }

  const attendanceRecords = await Attendance.findAll({
    where: {
      employeeId: userId,
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const attendanceMap = Object.fromEntries(
  attendanceRecords.map(a => {
    const dateStr = typeof a.date === 'string'
      ? a.date
      : new Date(a.date).toISOString().split('T')[0];
    return [dateStr, a];
  })
);


  const leaveRecords = await LeaveRecord.findAll({
    where: {
      userId,
      status: 'Approved',
      [Op.or]: [
        { fromDate: { [Op.between]: [startDate, endDate] } },
        { toDate: { [Op.between]: [startDate, endDate] } },
        {
          fromDate: { [Op.lte]: startDate },
          toDate: { [Op.gte]: endDate },
        },
      ],
    },
  });

  const paidLeaveDates = new Set();
  const unpaidLeaveDates = new Set();

  for (const record of leaveRecords) {
    const from = new Date(record.fromDate);
    const to = new Date(record.toDate);
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (record.leaveType === 'Unpaid') {
        unpaidLeaveDates.add(dateStr);
      } else {
        paidLeaveDates.add(dateStr);
      }
    }
  }

  const getDateArray = (start, end) => {
    const arr = [];
    const dt = new Date(start);
    while (dt <= new Date(end)) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };

  const getWeekNumberOfMonth = (date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOffset = first.getDay();
    return Math.floor((date.getDate() + dayOffset - 1) / 7) + 1;
  };

  const isWeeklyOff = (date, patterns) => {
    const dow = date.getDay();
    const weekNum = getWeekNumberOfMonth(date);
    for (const off of patterns) {
      if (off.dayOfWeek !== dow) continue;
      if (off.isFixed) return true;
      if (off.isAlternate && off.weekNumbers?.split(',').map(Number).includes(weekNum)) {
        return true;
      }
    }
    return false;
  };

  const allDates = getDateArray(startDate, endDate);

  const logs = [];

  for (const d of allDates) {
    const dateStr = d.toISOString().split('T')[0];
    const att = attendanceMap[dateStr];

    let status = 'Absent';
    let workingHours = 0;
    let overtimeHours = 0;
    let checkIn = null;
    let checkOut = null;

    if (holidayDates.includes(dateStr)) {
      status = 'Holiday';
    } else if (weeklyOffs.length > 0 && isWeeklyOff(d, weeklyOffs)) {
      status = 'Weekly Off';
    } else if (paidLeaveDates.has(dateStr)) {
      status = 'Paid Leave';
    } else if (unpaidLeaveDates.has(dateStr)) {
      status = 'Unpaid Leave';
    }  else if (att?.status === 'Present' || att?.status === 'Unscheduled') {
  status = 'Present';
  workingHours = parseFloat(att.workingHours || 0);
  overtimeHours = parseFloat(att.overtimeHours || 0);
  checkIn = att.checkIn ? new Date(`${att.date}T${att.checkIn}`).toISOString() : null;
  checkOut = att.checkOut ? new Date(`${att.date}T${att.checkOut}`).toISOString() : null;

} else if (att?.status === 'Half-Day') {
  status = 'Half-Day';
  workingHours = parseFloat(att.workingHours || 0);
  overtimeHours = parseFloat(att.overtimeHours || 0);
  checkIn = att.checkIn ? new Date(`${att.date}T${att.checkIn}`).toISOString() : null;
  checkOut = att.checkOut ? new Date(`${att.date}T${att.checkOut}`).toISOString() : null;

} else if (att?.checkIn && !att?.checkOut) {
  status = 'Half-Day';
  checkIn = att.checkIn ? new Date(`${att.date}T${att.checkIn}`).toISOString() : null;
  checkOut = null;
}


    logs.push({
      date: dateStr,
      day: d.toLocaleString('en-US', { weekday: 'long' }),
      status,
      workingHours,
      overtimeHours,
      checkIn,
      checkOut,
    });
  }

  return logs;
};

