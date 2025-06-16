import moment from 'moment';
import models, { sequelize } from "../models/index.js";

const {  Attendance, AttendanceSetting, EmployeeShiftSchedule  } = models;

export const assignShiftToEmployee = async (req, res) => {
  try {
    const { userId, date, attendanceSettingId } = req.body;
    console.log('[Request Body]', { userId, date, attendanceSettingId });

    const [schedule, created] = await EmployeeShiftSchedule.findOrCreate({
      where: { userId, date },
      defaults: { attendanceSettingId },
    });

    console.log('[FindOrCreate Result]', { scheduleId: schedule.id, created });

    if (!created) {
      console.log('[Shift Assignment Failed] Shift already assigned for this employee on this date:', date);
      return res.status(400).json({ message: "Shift already assigned for this employee on this date." });
    }

    console.log('[Shift Assigned Successfully]', schedule.toJSON());

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    console.error('[Error in assignShiftToEmployee]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
