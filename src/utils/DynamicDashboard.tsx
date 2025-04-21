import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "../feature-module/mainMenu/adminDashboard";
import EmployeeDashboard from "../feature-module/mainMenu/employeeDashboard/employee-dashboard";
import { RootState } from "../core/data/redux/store";
import SuperAdminDashboard from "../feature-module/super-admin/dashboard";

const DynamicDashboard = () => {
    const role = useSelector((state: RootState) => state.auth.user?.role);
    console.log(role, "@@@@@@@@@@@@@zds@@@@@@");


    switch (role) {
        case "COMPANY_ADMIN":
            return <AdminDashboard />;
        case "EMPLOYEE":
            return <EmployeeDashboard />;
        case "SUPER_ADMIN":
            return <SuperAdminDashboard />;
        default:
            return <h2>Unauthorized Dashboard Access</h2>;
    }
};

export default DynamicDashboard;
