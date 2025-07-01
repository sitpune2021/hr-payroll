import { calculatePay } from "../utils/CalculatePays.js";

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

export {calculatePaymentController}