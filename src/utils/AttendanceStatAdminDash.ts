import { AttendanceRecord } from "../core/data/redux/companyDateAttendanceSlice";
import { CompanyUser } from "../core/data/redux/companysUsersSlice";

export interface SummaryItem {
  label: string;
  value: number;
  color: string;
}
const getAttendanceSummaryAdminDashStat = (
  employees: CompanyUser[],
  attendanceRecords: AttendanceRecord[]
): SummaryItem[] => {
  const summary = {
    Total: employees.length,
    Present: 0,
    Absent: 0,
    "Half Day": 0,
    "Late Comers": 0,
    "Early Leaving": 0,
    "On Break": 0,
    "On Leave": 0,
  };

  const attendedEmployeeIds = new Set<number>();

  attendanceRecords.forEach((record) => {
    attendedEmployeeIds.add(record.employeeId);

    switch (record.status) {
      case "Present":
        summary.Present++;
        break;
      case "Absent":
        summary.Absent++; // Optional: if your punch log includes explicit absents
        break;
      case "Half-Day":
        summary["Half Day"]++;
        break;
      case "On Break":
        summary["On Break"]++;
        break;
      case "Leave":
      case "On Leave":
        summary["On Leave"]++;
        break;
    }

    if (record.isLate) summary["Late Comers"]++;
    if (record.isEarlyLeave) summary["Early Leaving"]++;
  });

  // Calculate absent if not recorded in punch logs
  summary.Absent = employees.filter(emp => !attendedEmployeeIds.has(emp.id)).length;

  const colorMap: Record<string, string> = {
    "Total": "#8000FF",
    "Present": "#00B050",
    "Absent": "#FF0000",
    "Half Day": "#FFC000",
    "Late Comers": "#B266FF",
    "Early Leaving": "#00B0F0",
    "On Break": "#00FFFF",
    "On Leave": "#FFD966"
  };

  return Object.entries(summary).map(([label, value]) => ({
    label,
    value,
    color: colorMap[label]
  }));
};

export default getAttendanceSummaryAdminDashStat;
