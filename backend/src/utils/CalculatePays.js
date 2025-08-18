import logger from '../config/logger.js';
import models from '../models/index.js';
import { getAttendanceSummary } from './GetAttendanceSummary.js';

const { User, PayrollComponent,Company,Branch, PayrollTemplate } = models;

export const calculatePay = async (userId, startDate, endDate) => {
  logger.info(`calclulate pay method called----`)
  const summary = await getAttendanceSummary(userId, startDate, endDate);

 const user = await User.findByPk(userId, {
    include: [
      { model: PayrollTemplate, include: [PayrollComponent] },
      { model: Company },   // include company details
      { model: Branch },    // include branch details
    ],
  });

  if (!user) throw new Error('User not found');

  const { paymentMode = 'Month', basicSalary = 0 } = user;
  const eligiblePaidDays =
    summary.presentDays + summary.paidLeaveDays + summary.holidays + summary.weeklyOffs;

  let perDayRate = 0;
  let hourlyRate = 0;
  let totalHoursWorked = summary.totalHoursWorked || 0;
  let grossPay = 0;

  // Calculate base pay
  if (paymentMode === 'Month') {
    perDayRate = basicSalary / 30;
    grossPay = perDayRate * eligiblePaidDays;
  } else if (paymentMode === 'Day') {
    perDayRate = basicSalary;
    grossPay = perDayRate * eligiblePaidDays;
  } else if (paymentMode === 'Hour') {
    hourlyRate = basicSalary;
    grossPay = hourlyRate * totalHoursWorked;
  }

  let allowanceTotal = 0;
  let deductionTotal = 0;
  let bonusTotal = 0;
  const payrollComponentsBreakdown = [];

  if (user.payrollTemplate && user.PayrollTemplate?.PayrollComponents) {
    for (const component of user.PayrollTemplate.PayrollComponents) {
      const base = grossPay;
      let amount = 0;

      if (component.amountType === 'Fixed') {
        amount = component.value;
      } else if (component.amountType === 'Percentage') {
        amount = (component.value / 100) * base;
      }

      if (component.type === 'Allowance') {
        allowanceTotal += amount;
      } else if (component.type === 'Deduction') {
        deductionTotal += amount;
      } else if (component.type === 'Bonus') {
        bonusTotal += amount;
      }

      payrollComponentsBreakdown.push({
        name: component.name,
        type: component.type,
        amountType: component.amountType,
        value: component.value,
        calculatedAmount: Number(amount.toFixed(2)),
      });
    }
  }

  const finalPay = grossPay + allowanceTotal + bonusTotal - deductionTotal;

  const calculationDescription = `
Payment Mode: ${paymentMode}
Basic Salary: ${basicSalary}
Per Day Rate: ${perDayRate.toFixed(2)}
Hourly Rate: ${hourlyRate.toFixed(2)}
Eligible Paid Days: ${eligiblePaidDays}
Total Hours Worked: ${totalHoursWorked}
Gross Pay: ${grossPay.toFixed(2)}

Add Allowances: ${allowanceTotal.toFixed(2)}
Add Bonuses: ${bonusTotal.toFixed(2)}
Subtract Deductions: ${deductionTotal.toFixed(2)}

Final Pay = Gross Pay + Allowances + Bonuses - Deductions = ${finalPay.toFixed(2)}
  `.trim();

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
    allowanceTotal: Number(allowanceTotal.toFixed(2)),
    deductionTotal: Number(deductionTotal.toFixed(2)),
    bonusTotal: Number(bonusTotal.toFixed(2)),
    finalPay: Number(finalPay.toFixed(2)),
    payrollComponentsBreakdown,
    calculationDescription,
    ...summary,
    company: user.Company
      ? {
          name: user.Company.name,
          address: user.Company.address,
          phone: user.Company.phone,
          companyImage: user.Company.companyImage,
          email: user.Company.email,
        }
      : null,

    branch: user.Branch
      ? {
          name: user.Branch.name,
          address: user.Branch.address,
          contact: user.Branch.phone,
          email: user.Branch.email,
          nameOfSalarySlip: user.Branch.nameOfSalarySlip,
          branchLogoFileName: user.Branch.branchLogoFileName
        }
      : null,
  };
};

