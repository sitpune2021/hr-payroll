import { calculatePay } from "../utils/CalculatePays.js";

import models from '../models/index.js';

const { User, PayrollComponent, PayrollTemplate } = models;

const calculatePaymentController = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.body;

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ message: 'userId, startDate, and endDate are required' });
    }

    const payrollData = await calculatePay(userId, startDate, endDate);
    res.json(payrollData);
  } catch (error) {
    console.error('Error calculating pay:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const calculatePaymentForGroup = async (req, res) => {
  try {
    const { companyId, branchId, startDate, endDate } = req.body;

    if (!companyId || !startDate || !endDate) {
      return res.status(400).json({ 
        message: 'companyId, startDate, and endDate are required' 
      });
    }

    // Step 1: Build filter condition
    const whereCondition = { companyId };
    if (branchId) {
      whereCondition.branchId = branchId;
    }

    // Step 2: Fetch all users
    const users = await User.findAll({
      where: whereCondition,
      attributes: ['id', 'firstName', 'lastName'],
      raw: true,
    });

    if (!users.length) {
      return res.status(404).json({ message: 'No users found for given filters' });
    }

    // Step 3: Calculate pay for all users in parallel
    const payResults = await Promise.all(
      users.map(user => calculatePay(user.id, startDate, endDate))
    );

    // Step 4: Aggregate company/branch totals
    const totals = payResults.reduce(
      (acc, record) => {
        acc.totalAllowance += record.allowanceTotal;
        acc.totalDeduction += record.deductionTotal;
        acc.totalPay += record.finalPay; // net pay
        return acc;
      },
      { totalAllowance: 0, totalDeduction: 0, totalPay: 0 }
    );

    // Step 5: Response
    res.json({
      totals: {
        totalAllowance: Number(totals.totalAllowance.toFixed(2)),
        totalDeduction: Number(totals.totalDeduction.toFixed(2)),
        totalPay: Number(totals.totalPay.toFixed(2)), // net pay
      },
      startDate,
      endDate,
      employees: payResults.map(record => ({
        userId: record.userId,
        name: record.name,
        netPay: Number(record.finalPay.toFixed(2)),
      }))
    });

  } catch (error) {
    console.error('Error calculating group pay:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export {calculatePaymentController,calculatePaymentForGroup}