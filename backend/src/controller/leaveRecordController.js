import models from '../models/index.js';
const { LeaveRecord, UserLeaveQuota, User, LeaveTemplate } = models;
import { Op } from 'sequelize';

const applyLeave = async (req, res) => {
    try {
        const { userId, leaveType, fromDate, toDate, reason } = req.body;



        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const start = new Date(fromDate);
        const end = new Date(toDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        if (end < start) {
            return res.status(400).json({ message: 'To Date cannot be before From Date' });
        }

        const oneDay = 1000 * 60 * 60 * 24;
        const totalDays = Math.round((end - start) / oneDay) + 1;

        const leave = await LeaveRecord.create({
            userId,
            leaveType,
            fromDate,
            toDate,
            totalDays,
            reason,
            status: 'Applied',
        });

        return res.status(201).json({ message: 'Leave applied successfully', leave });

    } catch (error) {
        console.error('Apply Leave Error:', error);
        return res.status(500).json({ message: 'Error applying leave', error: error.message });
    }
};


const updateLeaveStatus = async (req, res) => {
    try {

        const { leaveId, status, approverId, remarks } = req.body;


        const leave = await LeaveRecord.findByPk(leaveId);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        console.log("approver id",approverId);
        console.log("approver id",leave.approverId);

        leave.status = status;
        leave.approverId = approverId;
        leave.remarks = remarks;

        
        await leave.save();

        // 🧮 If approved and paid/sick/casual → update UserLeaveQuota
        if (status === 'Approved' && leave.leaveType !== 'Unpaid') {
            const date = new Date(leave.fromDate);
            const year = date.getFullYear();

            const [quota] = await UserLeaveQuota.findOrCreate({
                where: {
                    userId: leave.userId,
                    year,
                },
                defaults: {
                    paidLeavesTaken: 0,
                    sickLeavesTaken: 0,
                    casualLeavesTaken: 0,
                }
            });

            if (leave.leaveType === 'Paid') quota.paidLeavesTaken += leave.totalDays;
            if (leave.leaveType === 'Sick') quota.sickLeavesTaken += leave.totalDays;
            if (leave.leaveType === 'Casual') quota.casualLeavesTaken += leave.totalDays;

            await quota.save();
        }

        return res.status(200).json({ message: `Leave ${status.toLowerCase()} successfully`, leave });

    } catch (error) {
        console.error('Update Leave Status Error:', error);
        return res.status(500).json({ message: 'Error updating leave status', error: error.message });
    }
};

const fetchUsersLeaveRecordStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Validate User
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Try to get Leave Template (fallback to 0 quotas if not found)
    let leaveTemplate = await LeaveTemplate.findByPk(user.leaveTemplateId);
    leaveTemplate = leaveTemplate || {
      paidLeaveQuota: 0,
      sickLeaveQuota: 0,
      casualLeaveQuota: 0,
    };

    // 3. Get current year
    const now = new Date();
    const currentYear = now.getFullYear();

    // 4. Try to get User Leave Quota (fallback to 0 taken if not found)
    const quota = await UserLeaveQuota.findOne({
      where: {
        userId: user.id,
        year: currentYear,
      },
    });

    const taken = quota || {
      paidLeavesTaken: 0,
      sickLeavesTaken: 0,
      casualLeavesTaken: 0,
    };

    // 5. Calculate balance
    const balance = {
      paidLeaveBalance: leaveTemplate.paidLeaveQuota - taken.paidLeavesTaken,
      sickLeaveBalance: leaveTemplate.sickLeaveQuota - taken.sickLeavesTaken,
      casualLeaveBalance: leaveTemplate.casualLeaveQuota - taken.casualLeavesTaken,
    };

    // 6. Return consistent response
    return res.status(200).json({
      userId,
      year: currentYear,
      allowed: {
        paidLeaveQuota: leaveTemplate.paidLeaveQuota,
        sickLeaveQuota: leaveTemplate.sickLeaveQuota,
        casualLeaveQuota: leaveTemplate.casualLeaveQuota,
      },
      taken: {
        paidLeavesTaken: taken.paidLeavesTaken,
        sickLeavesTaken: taken.sickLeavesTaken,
        casualLeavesTaken: taken.casualLeavesTaken,
      },
      balance,
    });

  } catch (error) {
    console.error('Fetch Leave Stats Error:', error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};



const getCompanyLeaveRecords = async (req, res) => {
  try {
    const { companyId, fromDate, toDate } = req.query;

    if (!companyId || !fromDate || !toDate) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Ensure `to` includes the full day (set to end of day)
    to.setHours(23, 59, 59, 999);

    console.log("Parsed Dates:", from.toISOString(), to.toISOString());

    const leaveRecords = await LeaveRecord.findAll({
      include: [
        {
          model: User,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          where: {
            companyId: companyId,
          },
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(leaveRecords);
  } catch (error) {
    console.error("Error fetching leave records:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const userLeaveDetailsController = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.query;

    if (!userId || !fromDate || !toDate) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999); // Include full day

    if (isNaN(from) || isNaN(to)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const leaveRecords = await LeaveRecord.findAll({
      where: {
        userId,
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      include: [
        {
          model: User,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(leaveRecords);
  } catch (error) {
    console.error("Error fetching user leave records:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getLeaveById = async (req, res) => {
  try {
    const { leaveId } = req.params;

    if (!leaveId) {
      return res.status(400).json({ message: "Leave ID is required" });
    }

    const leave = await LeaveRecord.findByPk(leaveId, {
      include: [
        {
          model: User,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    return res.status(200).json(leave);
  } catch (error) {
    console.error("Error fetching leave by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const editLeaveIfApplied = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { leaveType, fromDate, toDate, reason } = req.body;

    const leave = await LeaveRecord.findByPk(leaveId);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.status !== 'Applied') {
      return res.status(403).json({ message: 'Only leaves with status "Applied" can be edited' });
    }

    // Validate dates
    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (end < start) {
      return res.status(400).json({ message: 'To Date cannot be before From Date' });
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.round((end - start) / oneDay) + 1;

    // Update values
    leave.leaveType = leaveType;
    leave.fromDate = fromDate;
    leave.toDate = toDate;
    leave.totalDays = totalDays;
    leave.reason = reason;

    await leave.save();

    return res.status(200).json({ message: 'Leave updated successfully', leave });

  } catch (error) {
    console.error('Edit Leave Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};




export { editLeaveIfApplied,getLeaveById,userLeaveDetailsController,applyLeave, updateLeaveStatus, fetchUsersLeaveRecordStats, getCompanyLeaveRecords }