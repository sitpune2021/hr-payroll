import moment from 'moment';
import models, { sequelize } from "../models/index.js";
import { where } from 'sequelize';

const {  Attendance, AttendanceSetting,Branch, EmployeeShiftSchedule  } = models;

 const createShift = async (req, res) => {
  try {
    const {
      shiftName,
      checkInTime,
      checkOutTime,
      gracePeriodMinutes,
      earlyLeaveAllowanceMinutes,
      branchId,
    } = req.body;

    const newShift = await AttendanceSetting.create({
      shiftName,
      checkInTime,
      checkOutTime,
      gracePeriodMinutes,
      earlyLeaveAllowanceMinutes,
      branchId,
    });

    res.status(201).json({ success: true, data: newShift });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}; 

const fetchShiftList = async(req,res) =>{
  try {
    const shifts =await AttendanceSetting.findAll({
      attributes: ["id", "shiftName", "checkInTime", "checkOutTime","gracePeriodMinutes","earlyLeaveAllowanceMinutes","branchId"],
    });

res.status(200).json(shifts);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

const editShift = async (req,res)=>{
  try {
    const shiftId = req.params.shiftId;
    const {
      shiftName,
      checkInTime,
      checkOutTime,
      gracePeriodMinutes,
      earlyLeaveAllowanceMinutes,
      branchId,
    } = req.body;

    const shift= await AttendanceSetting.findOne({
      where:{
        id:shiftId
      }
    });

    const branch= await Branch.findOne({
      where:{
        id:branchId
      }
    })

    if(!shift){
      return res.status(404).json({ success: false, message: "Shift not found"});
    }
    if(!branch){
      return res.status(404).json({ success: false, message: "Branch not found"});
    }
    shift.shiftName = shiftName;
    shift.checkInTime = checkInTime;
    shift.checkOutTime = checkOutTime;
    shift.gracePeriodMinutes = gracePeriodMinutes;
    shift.earlyLeaveAllowanceMinutes = earlyLeaveAllowanceMinutes;
    shift.branchId = branchId;

    await shift.save();
    return res.status(200).json({ success: true, message: "Shift updated successfully" });
  } catch (error) {
    return res.status(500).json({message:error});
  }

}

export { createShift, fetchShiftList,editShift };
