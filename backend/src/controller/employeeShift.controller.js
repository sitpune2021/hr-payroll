import moment from 'moment';
import models, { sequelize } from "../models/index.js";

const {  Attendance, AttendanceSetting, EmployeeShiftSchedule  } = models;

export const assignShiftToEmployee = async (req, res) => {
  try {
    const { userId, date, attendanceSettingId } = req.body;

    const [schedule, created] = await EmployeeShiftSchedule.findOrCreate({
      where: { userId, date },
      defaults: { attendanceSettingId }
    });

    if (!created) {
      return res.status(400).json({ message: "Shift already assigned for this employee on this date." });
    }

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
