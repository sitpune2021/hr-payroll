import models, { sequelize } from "../models/index.js";
import { deleteImageFile, saveImageFile } from "../utils/imageUtils.js";
import logger from '../config/logger.js';

const { Company, User, Role, Department } = models;


const AdminDashboard = async (req, res) => {

    try {
      logger.info(`${req.user.id}--admin dashboard data fetch controller entry`)
    const { companyId } = req.query;
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const branchId = req.query.branchId || null;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const { User, Attendance } = models;

    // Step 1: Get all users
    const userWhere = { companyId };
    if (branchId) userWhere.branchId = branchId;

    const allUsers = await User.findAll({
      where: userWhere,
      attributes: ['id']
    });

    const userIds = allUsers.map(user => user.id);

    // Step 2: Get attendance for given date
    const attendances = await Attendance.findAll({
      where: {
        employeeId: userIds,
        date
      },
      attributes: ['employeeId', 'status', 'isLate', 'isEarlyLeave']
    });

    // Step 3: Calculate counts
    const counts = {
      total: userIds.length,
      present: attendances.length,
      absent: userIds.length - attendances.length,
      halfDay: 0,
      leave: 0,
      lateComers: 0,
      earlyLeaving: 0,
      onBreak: 0 // reserved
    };

    attendances.forEach((a) => {
      if (a.status === 'Half-Day') counts.halfDay++;
      if (a.status === 'Leave') counts.leave++;
      if (a.isLate) counts.lateComers++;
      if (a.isEarlyLeave) counts.earlyLeaving++;
    });
    logger.info(`${req.user.id}-- admin dashboard data fetched successfully`)
    return res.status(200).json({
      date,
      branchId,
      ...counts
    });

  } catch (error) {
    logger.error(`${req.user.id}--${error.message}--error in admin dashboard data fetching`)
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }

}

export { AdminDashboard }