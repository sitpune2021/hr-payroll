import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatToDDMonthNameYYYY } from "../../utils/formatDateDDMonthNameYYYY";

interface AttendanceLog {
  date: string;
  day: string;
  status: string;
  workingHours: number;
  overtimeHours: number;
  checkIn: string | null;
  checkOut: string | null;
}

interface AttendanceSummary {
  userId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  workingDays: number;
  presentDays: number;
  halfDayCount: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  holidays: number;
  weeklyOffs: number;
  absentDays: number;
  totalHoursWorked: number;
  totalOvertimeWorked: number;
}

export const exportAttendanceLogsToPDF = (
  logs: AttendanceLog[],
  companyName: string,
  branchName: string,
  userName: string,
  startDate: string,
  endDate: string,
  attendanceSummary: AttendanceSummary | null
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("Attendance Report", 14, 20);

  doc.setFontSize(10);

  // Inline header info
  doc.text(`Company: ${companyName}`, 14, 30);
  doc.text(`Branch: ${branchName}`, 80, 30);
  doc.text(`Employee: ${userName}`, 140, 30);

  // Period row
  doc.text(
    `Period: ${formatToDDMonthNameYYYY(startDate)} to ${formatToDDMonthNameYYYY(endDate)}`,
    14,
    38
  );

  // Top right generated at
  const generatedAt = new Date();
  const generatedAtStr = `Generated at: ${generatedAt.toLocaleString()}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(generatedAtStr);
  doc.text(generatedAtStr, pageWidth - textWidth - 14, 20);

  // Table rows
  const rows = logs.map((log) => [
    formatToDDMonthNameYYYY(log.date),
    log.day,
    log.status,
    log.workingHours,
    log.overtimeHours,
    log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : "-",
    log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : "-",
  ]);

  // Logs table
  autoTable(doc, {
    startY: 45,
    head: [["Date", "Day", "Status", "Working Hrs", "OT Hrs", "Check In", "Check Out"]],
    body: rows,
    styles: { fontSize: 8 },
  });

  // ✅ Add summary table ONLY if summary is available
  if (attendanceSummary) {
    const summaryStartY = (doc as any).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: summaryStartY,
      head: [["Attendance Summary", ""]],
      body: [
        ["Total Days", attendanceSummary.totalDays],
        ["Working Days", attendanceSummary.workingDays],
        ["Present Days", attendanceSummary.presentDays],
        ["Half Days", attendanceSummary.halfDayCount],
        ["Paid Leave", attendanceSummary.paidLeaveDays],
        ["Unpaid Leave", attendanceSummary.unpaidLeaveDays],
        ["Holidays", attendanceSummary.holidays],
        ["Weekly Offs", attendanceSummary.weeklyOffs],
        ["Absent Days", attendanceSummary.absentDays],
        ["Total Hours Worked", attendanceSummary.totalHoursWorked],
        ["Total Overtime Worked", attendanceSummary.totalOvertimeWorked],
      ],
      styles: { fontSize: 8 },
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220] },
    });
  }

  doc.save(
    `Attendance_${userName}_${formatToDDMonthNameYYYY(startDate)}_to_${formatToDDMonthNameYYYY(endDate)}.pdf`
  );
};
