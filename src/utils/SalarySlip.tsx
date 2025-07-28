import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// types.d.ts or top of SalarySlip.tsx
import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

// TypeScript interface for salaryData
interface PayrollComponent {
  name: string;
  type: "Allowance" | "Deduction" | "Bonus";
  amountType: "Fixed" | "Percentage";
  value: number;
  calculatedAmount: number;
}

 export interface SalaryData {
  userId: number;
  name: string;
  startDate: string;
  endDate: string;
  paymentMode: string;
  basicSalary: number;
  perDayRate: number;
  hourlyRate: number;
  eligiblePaidDays: number;
  totalHoursWorked: number;
  grossPay: number;
  allowanceTotal: number;
  deductionTotal: number;
  bonusTotal: number;
  finalPay: number;
  payrollComponentsBreakdown: PayrollComponent[];
  calculationDescription: string;
  presentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  absentDays: number;
}

// Component Props
interface Props {
  salaryData: SalaryData;
}

const SalarySlip: React.FC<Props> = ({ salaryData }) => {
  const generateSalarySlip = () => {
    const doc = new jsPDF();

    const {
      userId,
      name,
      startDate,
      endDate,
      paymentMode,
      basicSalary,
      grossPay,
      finalPay,
      allowanceTotal,
      deductionTotal,
      bonusTotal,
      calculationDescription,
      payrollComponentsBreakdown,
      presentDays,
      paidLeaveDays,
      unpaidLeaveDays,
      absentDays,
      totalHoursWorked,
    } = salaryData;

    // Header
    doc.setFontSize(14);
    doc.text("VEGAYAN SYSTEMS PVT.LTD.", 15, 15);
    doc.setFontSize(10);
    doc.text("A-1111-1116, Kailas Business Park, Hiranandani Link Road", 15, 22);
    doc.text("Park Site, Vikhroli (West), Mumbai-400079", 15, 27);

    doc.setFontSize(12);
    doc.text(`Salary Slip for: ${startDate} to ${endDate}`, 15, 38);

    // Employee Info
    autoTable(doc, {
      startY: 45,
      body: [
        ["Employee ID", userId],
        ["Employee Name", name],
        ["Payment Mode", paymentMode],
        ["Basic Salary", `Rs ${basicSalary}`],
        ["Present Days", presentDays],
        ["Paid Leaves", paidLeaveDays],
        ["Unpaid Leaves", unpaidLeaveDays],
        ["Absent Days", absentDays],
        ["Total Hours Worked", totalHoursWorked],
      ],
      theme: "grid",
    });

    // Earnings/Deductions
    autoTable(doc, {
      startY: doc.lastAutoTable?.finalY! + 10,
      head: [["Earnings", "Amount (Rs)", "Deductions", "Amount (Rs)"]],
      body: [
        ["Gross Pay", grossPay, "Deductions", deductionTotal],
        ["Allowances", allowanceTotal, "", ""],
        ["Bonuses", bonusTotal, "", ""],
        ["", "", "Total Deductions", deductionTotal],
      ],
      theme: "grid",
    });

    // Net Pay
    autoTable(doc, {
      startY: doc.lastAutoTable?.finalY! + 10,
      body: [["Net Salary Payable", `Rs ${finalPay.toFixed(2)}`]],
      theme: "grid",
      styles: { halign: "center", fontSize: 12, fillColor: [204, 255, 204] },
    });

    // Payroll Components Breakdown
    autoTable(doc, {
      startY: doc.lastAutoTable?.finalY! + 10,
      head: [["Component", "Type", "Amount Type", "Value", "Calculated Amount"]],
      body: payrollComponentsBreakdown.map((item) => [
        item.name,
        item.type,
        item.amountType,
        item.value,
        `₹ ${item.calculatedAmount}`,
      ]),
      theme: "striped",
    });

    // Calculation Description
    doc.setFontSize(10);
    doc.text("Calculation Details:", 15, doc.lastAutoTable?.finalY! + 15);
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(calculationDescription, 180), 15, doc.lastAutoTable?.finalY! + 20);

    // Save PDF
    doc.save(`${name.replace(/\s+/g, "_")}_Salary_Slip.pdf`);
  };

  return (
    <button onClick={generateSalarySlip} className="btn btn-success">
      Calculate Salary & Download PDF
    </button>
  );
};

export default SalarySlip;
