import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// types.d.ts or top of SalarySlip.tsx
import "jspdf";
import axios from "axios";
import { baseURL } from "../axiosConfig/axiosClient";

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
export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  companyImage: string;
  email: string;
}

export interface BranchInfo {
  name: string;
  address: string;
  contact: string;
  email: string;
  nameOfSalarySlip: string;
  branchLogoFileName: string;
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
  company: CompanyInfo | null;
  branch: BranchInfo | null;
}

// Component Props
interface Props {
  salaryData: SalaryData;
}

const SalarySlip: React.FC<Props> = ({ salaryData }) => {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const fetchLogo = async (imgName:String) => {
      try {
        const response = await axios.get(
          `${baseURL}/api/image/img/${imgName}`,
          { responseType: "blob" } // important
        );

        // Convert Blob → Base64
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          setLogoBase64(reader.result as string);
        };
      } catch (err) {
        console.warn("No logo found, continuing without logo");
        console.error("Error fetching logo:", err);
      }
    
  };

  useEffect(()=>{
    if(salaryData.company && salaryData.company.companyImage){
      console.log("use effect loafing indfg");
      
          fetchLogo(salaryData.company.companyImage)
    }
  },[])

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

 
    const pdfWidth = doc.internal.pageSize.getWidth(); // ✅ define width
    const pdfHeight = doc.internal.pageSize.getHeight(); // (optional agar chahiye)

    // ✅ Add logo only if available
    if (logoBase64) {
    const imgSize = 30; // image ka size
    const x = pdfWidth - imgSize - 15; // thoda left shift (margin 15)
    const y = 10;

    doc.addImage(logoBase64, "JPEG", x, y, imgSize, imgSize); // image lagana
  }

    // if (logoBase64) {
    //   doc.addImage(logoBase64, "JPEG", pdfWidth - 40, 10, 30, 30);
    // }
    doc.setFontSize(14);
    doc.text(`${salaryData.company?.name}`, 15, 15);
    doc.setFontSize(10);
    doc.text(`Branch name:${salaryData.branch?.name}`, 15, 22);
    doc.text(`Branch Address:${salaryData.branch?.address}`, 15, 27);
    doc.text(`${salaryData.branch?.email} ${salaryData.branch?.contact}`, 15, 32);

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
    <button
    //  disabled={logoBase64===null}
      onClick={generateSalarySlip} className="btn btn-success">
      Calculate Salary & Download PDF
    </button>
  );
};

export default SalarySlip;
