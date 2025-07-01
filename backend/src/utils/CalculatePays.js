
import models from '../models/index.js';
import { getAttendanceSummary } from './GetAttendanceSummary.js';

const { User, Attendance } = models;

export const calculatePay = async (userId, startDate, endDate) => {
    // Get attendance summary
    const summary = await getAttendanceSummary(userId, startDate, endDate);

    // Fetch user to access basicSalary and paymentMode
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const paymentMode = user.paymentMode || 'Month'; // Month, Day, Hour
    const basicSalary = user.basicSalary || 0;

    const eligiblePaidDays = summary.presentDays + summary.paidLeaveDays + summary.holidays + summary.weeklyOffs;

    let grossPay = 0;
    let perDayRate = 0;
    let hourlyRate = 0;
    let totalHoursWorked = 0;

    if (paymentMode === 'Month') {
        // Assume 30-day month
        perDayRate = basicSalary / 30;
        grossPay = perDayRate * eligiblePaidDays;
    } else if (paymentMode === 'Day') {
        perDayRate = basicSalary;
        grossPay = perDayRate * eligiblePaidDays;
    } else if (paymentMode === 'Hour') {
        // Sum up hours worked from attendance

        totalHoursWorked = summary.totalHoursWorked;

        hourlyRate = basicSalary;
        grossPay = hourlyRate * totalHoursWorked;
    }

    // Final result
    return {
        userId,
        name: `${user.firstName} ${user.lastName}`,
        startDate,
        endDate,
        paymentMode,
        basicSalary,
        perDayRate: Number(perDayRate.toFixed(2)),
        hourlyRate: Number(hourlyRate.toFixed(2)),
        eligiblePaidDays,
        totalHoursWorked,
        grossPay: Number(grossPay.toFixed(2)),
        ...summary, // include breakdown: presentDays, holidays, etc.
    };
};
