import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/data/redux/store";
import AttendanceEmployee from "./attendance_employee";
import AttendanceAdmin from "./attendanceadmin";
import BranchManagerAttendance from "./BranchManagerAttendance";
import SuperAdminAttendance from "./SuperAdminAttendance";

const DynamicAttendance = () => {
    const roleRaw = useSelector((state: RootState) => state.auth.user?.role);

    // Normalize role string (remove whitespace, make uppercase)
    const role = (roleRaw || "").trim().toUpperCase();

    switch (role) {
        case "COMPANY_ADMIN":
            return <AttendanceAdmin />;
        case "EMPLOYEE":
            return <AttendanceEmployee />;
        case "BRANCH_MANAGER":
            return <BranchManagerAttendance />;
        case "SUPER_ADMIN":
            return <SuperAdminAttendance />;
        default:
            return <h2>Unauthorized Access to Attendance</h2>;
    }
};

export default DynamicAttendance;
