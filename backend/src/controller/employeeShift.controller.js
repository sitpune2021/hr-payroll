import moment from 'moment';
import models from "../models/index.js";

const { Attendance, AttendanceSetting, EmployeeShiftSchedule } = models;

export const assignShiftToEmployee = async (req, res) => {
  try {
    const { userId, fromDate, toDate, attendanceSettingId } = req.body;

    console.log('[Request Body]', { userId, fromDate, toDate, attendanceSettingId });

    const start = moment(fromDate);
    const end = moment(toDate);

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const assignments = [];

    for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      const date = m.format('YYYY-MM-DD');

      // Delete existing shift for the date
      await EmployeeShiftSchedule.destroy({ where: { userId, date } });

      // Create new shift
      const newShift = await EmployeeShiftSchedule.create({
        userId,
        date,
        attendanceSettingId,
      });

      assignments.push(newShift);
    }

    res.status(201).json({ success: true, assigned: assignments.length });
  } catch (error) {
    console.error('[Error in assignShiftToEmployee]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
