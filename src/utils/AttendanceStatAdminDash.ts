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

    const isOnLeave = record.status === "Leave" || record.status === "On Leave";
    const isOnBreak = record.status === "On Break";
    const isHalfDay = record.status === "Half-Day";

    if (isOnLeave) {
      summary["On Leave"]++;
    } else if (isOnBreak) {
      summary["On Break"]++;
    } else {
      // Default to Present if not Leave or Break
      summary.Present++;

      // Mark additional attributes
      if (isHalfDay) summary["Half Day"]++;
      if (record.isLate) summary["Late Comers"]++;
      if (record.isEarlyLeave) summary["Early Leaving"]++;
    }
  });

  // Absent = employees who didn’t punch in at all (not even leave or break)
  summary.Absent = employees.filter(emp => {
    return !attendanceRecords.some(record =>
      record.employeeId === emp.id &&
      (record.status === "Present" || record.status === "Half-Day" || record.status === "On Break" || record.status === "Leave" || record.status === "On Leave")
    );
  }).length;

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
