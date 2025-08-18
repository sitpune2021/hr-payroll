import moment from 'moment';
import models, { sequelize } from "../models/index.js";
import { where } from 'sequelize';
import logger from '../config/logger.js';

const { Attendance, AttendanceSetting, Branch, EmployeeShiftSchedule } = models;

const createShift = async (req, res) => {
  try {
    logger.info(`${req.user.id}--Creating a new shift`);
    const {
      shiftName,
      checkInTime,
      checkOutTime,
      gracePeriodMinutes,
      earlyLeaveAllowanceMinutes,
      companyId
    } = req.body;

    const newShift = await AttendanceSetting.create({
      shiftName,
      checkInTime,
      checkOutTime,
      gracePeriodMinutes,
      earlyLeaveAllowanceMinutes,
      companyId
    });
    logger.info(`${req.user.id}-- shift created successfully`)
    res.status(201).json({ success: true, data: newShift });
  } catch (error) {
    logger.error(`${req.user.id}--Error creating shift: ${error}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

const fetchShiftList = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- fetch shift list`)
    const shifts = await AttendanceSetting.findAll({
      attributes: ["id", "shiftName", "checkInTime", "checkOutTime", "gracePeriodMinutes", "earlyLeaveAllowanceMinutes", "companyId"],
    });

    logger.info(`${req.user.id}-- shift list fetched successfully`)
    res.status(200).json(shifts);
  } catch (error) {
    logger.error(`${req.user.id}--Error fetching shift list: ${error}`);
    return res.status(500).json({ success: false, message: error.message });
  }
}

const editShift = async (req, res) => {
  try {
    logger.info(`${req.user.id}-- edit shift request controller entry`)
    const shiftId = req.params.shiftId;
    const {
      shiftName,
      checkInTime,
      checkOutTime,
      gracePeriodMinutes,
      earlyLeaveAllowanceMinutes,
      companyId
    } = req.body;

    const shift = await AttendanceSetting.findOne({
      where: {
        id: shiftId
      }
    });

    if (!shift) {
      return res.status(404).json({ success: false, message: "Shift not found" });
    }
    shift.shiftName = shiftName;
    shift.checkInTime = checkInTime;
    shift.checkOutTime = checkOutTime;
    shift.gracePeriodMinutes = gracePeriodMinutes;
    shift.earlyLeaveAllowanceMinutes = earlyLeaveAllowanceMinutes;
    shift.companyId = companyId;

    await shift.save();
    logger.info(`${req.user.id}-- shift edited successfully`)
    return res.status(200).json({ success: true, message: "Shift updated successfully" });
  } catch (error) {
    logger.error(`${req.user.id}--Error editing shift: ${error}`);
    return res.status(500).json({ message: error });
  }

}

export { createShift, fetchShiftList, editShift };
