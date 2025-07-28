import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { useAppDispatch, useAppSelector } from '../../../core/data/redux/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/data/redux/store';
import { toast } from '../../../utils/toastUtil';
import axiosClient from '../../../axiosConfig/axiosClient';
import { ADD_NEW_USER, EDIT_USER, FETCH_ATTENDANCE_LOGS_USER, FETCH_ATTENDANCE_SUMMARY_USER, FETCH_USER_LEAVE_STATS, UPLOAD_USERS_EXCEL } from '../../../axiosConfig/apis';
import { Company } from '../../../core/data/redux/companySlice';
import { Branch } from '../../../core/data/redux/branchesSlice';
import { fetchUsers, setSort, User } from '../../../core/data/redux/usersSlice';
import { formatDate } from '../../../utils/dateformatter1';
import { generateErrorExcelUserUpload } from '../../../utils/generateErrorExcelUploadUser';
import { Department } from '../../../core/data/redux/departmentsSlice';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Or use custom CSS
import { Template } from '../../../core/data/redux/payrolltemplateSlice';
import { Shift } from '../../../core/data/redux/shiftSlice';
import { Role } from '../../../core/data/redux/rolesSlice';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { fetchLeaveTemplates, LeaveTemplates } from '../../../core/data/redux/leaveTemplateSlice';
import { exportAttendanceLogsToPDF } from '../../reports/exportAttendanceLogsToPDF';
import { formatToDDMonthNameYYYY } from '../../../utils/formatDateDDMonthNameYYYY';
import SalarySlip, { SalaryData } from '../../../utils/SalarySlip';
import { fetchCompanysUsersThunk } from '../../../core/data/redux/companysUsersSlice';
type PasswordField = "password" | "confirmPassword";

const Users = () => {

    const dispatch = useAppDispatch();
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOption, setSortOption] = useState('Recently Added');
    const [roleFilter, setRoleFilter] = useState(0)
    const [allPayrollTemp, setAllPayrollTemp] = useState<Template[]>([])
    const [allcompany, setAllCompany] = useState<Company[]>([])
    const [allBranches, setAllBranches] = useState<Branch[]>([])
    const [limit, setLimit] = useState(10)
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
    const [allShifts, setAllSHifts] = useState<Shift[]>([])
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([])
    const [bankDetails, setBankDetails] = useState<File | null>(null);
    const [adhaarCard, setAdhaarCard] = useState<File | null>(null);
    const [panCard, setPanCard] = useState<File | null>(null);
    const [educationalQulif, setEducationalQulif] = useState<File | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [searchText, setSearchText] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // This assumes you have allEmployees fetched somewhere
    // If not, fetch and setAllEmployees from your API


    const [uploadExcelSelectedFormData, setUploadExcelSelectedFormData] = useState({
        companyId: '',
        branchId: '',
        departmentId: '',
        roleId: ''
    });

    const [uploadExcelFileData, setUploadExcelFileData] = useState<File | null>(null);


    const [employeeSearch, setEmployeeSearch] = useState("");

    const branchOptions = ['Branch 1', 'Branch 2', 'Branch 3', 'Branch 4']; // Dummy data
    const departmentOptions = ['Department 1', 'Department 2', 'Department 3']; // Dummy data
    const activeInactiveOptions = ['Yes', 'No'];   // Dummy Data
    const shiftTimingOptions = ['9AM to 6PM', '6PM to 12AM', '12AM to 6AM']; // Dummy data
    const [branch, setBranch] = useState<string[]>([]);
    const [department, setDepartment] = useState<string[]>([]);
    const [activeInactive, setActiveInactive] = useState<string[]>([]);
    const [shiftTiming, setShiftTiming] = useState<string[]>([]);

    const handleToggle = (option: any, group: any, setter: any, values: any) => {
        if (values.includes(option)) {
            setter(values.filter((v: any) => v !== option));
        } else {
            setter([...values, option]);
        }
    };

    const [allLeaveTemplates, setAllLeaveTemplates] = useState<LeaveTemplates[]>([]);
    const [viewUserDetails, setViewUserDetails] = useState<User>();
    const [userLeaveStats, setUserLeaveStats] = useState({
        userId: '',
        year: '',
        allowed: {
            paidLeaveQuota: 0,
            sickLeaveQuota: 0,
            casualLeaveQuota: 0
        },
        taken: {
            paidLeavesTaken: 0,
            sickLeavesTaken: 0,
            casualLeavesTaken: 0
        },
        balance: {
            paidLeaveBalance: 0,
            sickLeaveBalance: 0,
            casualLeaveBalance: 0
        }
    });

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


    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const fetchAttendance = async (start: string, end: string) => {
        if (!start || !end || !viewUserDetails) return;
        try {
            const response = await axiosClient.get(FETCH_ATTENDANCE_SUMMARY_USER, {
                params: {
                    userId: viewUserDetails?.id,
                    startDate,
                    endDate
                },
            });
            if (response.status === 200) {
                setAttendanceSummary(response.data);
            }
        } catch (error) {

        }

    };

    const getMonthStartEndDates = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const formatLocal = (date: Date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        };

        return {
            startDate: formatLocal(start),
            endDate: formatLocal(end),
        };
    };


    const fetchLogs = async (start: string, end: string) => {
        if (!start || !end || !viewUserDetails) return;
        try {
            const res = await axiosClient.get(
                FETCH_ATTENDANCE_LOGS_USER,
                {
                    params: {
                        userId: viewUserDetails?.id,
                        startDate: start,
                        endDate: end,
                    },
                }
            );
            if (res.status === 200) {
                setLogs(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const { startDate, endDate } = getMonthStartEndDates();
        setStartDate(startDate);
        setEndDate(endDate);
    }, []);
    useEffect(() => {
        if (startDate && endDate && viewUserDetails) {
            fetchLogs(startDate, endDate);
            fetchAttendance(startDate, endDate);
        }
    }, [startDate, endDate, viewUserDetails]);


    useEffect(() => {
        const fetchLeaveStatsOfUser = async (id: number) => {
            try {
                const response = await axiosClient.get(`${FETCH_USER_LEAVE_STATS}${id}`);
                if (response.status === 200) setUserLeaveStats(response.data);
            } catch (error) {
                console.error("Error fetching leave stats:", error);
            }
        };

        if (viewUserDetails) fetchLeaveStatsOfUser(viewUserDetails.id);
    }, [viewUserDetails]);






    const handleSortChange = (option: string) => {
        setSortOption(option);
    };

    const userAllowedLabels = useSelector((state: RootState) => state.feature.allowedFeatures);
    const filteredLabels = userAllowedLabels.map((feature: any) => feature.name);

    const [editUserData, setEditUserData] = useState<Partial<User>>();
    const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);

    const handleEditUserSubmit = async (e: any) => {
        e.preventDefault();
        const userData = editUserData;
        try {
            const response = await axiosClient.put(`${EDIT_USER}${editUserData?.id}`, userData);
            if (response.status === 200) {
                toast('Info', response.data.message, 'success');
            }
        } catch (error: any) {
            console.log(error);

            toast('Error', error.response.data.message, 'danger');
        }
    }
    const handleEditDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let parsedValue: string | number | null = value;
        if (name === "companyId" || name === "branchId" || name === "roleId") {
            parsedValue = value === "" ? null : parseInt(value);
        }

        setEditUserData(prev => ({
            ...prev,
            [name]: parsedValue,
            ...(name === "companyId" ? { branchId: null } : {}), // Reset branchId when company changes
        }));
    };
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        confirmPassword: false,
    });
    const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
        setPasswordVisibility((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const roles = useAppSelector((state) => state.roles.list);
    const loggedInuserRole = useSelector((state: RootState) => state.auth.user?.role);
    const loggedInRoleId = roles.find(role => role.name === loggedInuserRole)?.id;
    // const filteredRoles = loggedInRoleId !== undefined
    //     ? roles.filter(role => role.id > loggedInRoleId)
    //     : [];



    const user = useSelector((state: RootState) => state.auth.user);
    const companyList = useAppSelector((state) => state.companies.list);
    const branchList: Branch[] = useSelector((state: RootState) => state.branches.branches);
    const departmentList = useSelector((state: RootState) => state.departments.data)
    const { start, end } = useSelector((state: any) => state.dateRange);
    const roleList = useAppSelector((state: RootState) => state.roles.list);
    const payrollTemplates = useSelector((state: RootState) => state.payrollTemplate.templates);
    const shiftsList = useSelector((state: RootState) => state.shifts.shifts);
    const leaveTemplateList = useAppSelector((state) => state.leaveTemplate.templates);
      const companyUserList = useSelector((state: RootState) => state.companysEmployees.list);

    useEffect(() => {
        if (payrollTemplates.length > 0) {
            const loggedUsersCompany = companyList.find(
                (company) => company.id === user?.companyId
            );
            if (loggedUsersCompany) {
                setAllPayrollTemp(payrollTemplates.filter(temp => temp.companyId === loggedUsersCompany.id));
            } else {
                setAllPayrollTemp(payrollTemplates)
            }
        }
    }, [payrollTemplates, companyList, user?.companyId])

    useEffect(() => {

        if (user) {
            dispatch(fetchLeaveTemplates({ companyId: user.companyId }));
        }



        if (user && user.departmentId === 1) {
            setFilteredDepartments(departmentList)
        } else if (user && user.departmentId !== null) {
            const filtered = departmentList.filter(dept => dept.id > user.departmentId!);
            setFilteredDepartments(filtered);
        } else {
            setFilteredDepartments([]);
        }

        if (user && user.companyId) {
            const userLeaveTemplates = leaveTemplateList.filter(leaveTemp => leaveTemp.companyId === user.companyId);
            setAllLeaveTemplates(userLeaveTemplates);
        } else {
            setAllLeaveTemplates(leaveTemplateList);
        }
    }, [user, departmentList, dispatch]);

    useEffect(() => {
        if (user && user.companyId) {
            const usersSHifts = shiftsList.filter(
                (shift) => shift.companyId === user.companyId
            );
            const userCompROles = roles.filter(
                (role) => role.companyId === user.companyId
            )
            setFilteredRoles(userCompROles)
            setAllSHifts(usersSHifts);
        } else {
            setAllSHifts(shiftsList)
            setFilteredRoles(roles)
        }
    }, [user, shiftsList])

    const { list: users, loading, error, page, totalPages, sortField, sortOrder } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        if (user) {
            dispatch(
                fetchUsers({
                    companyId: user.companyId ?? undefined,
                    branchId: user.branchId ?? undefined,
                    roleId: loggedInRoleId,
                    page,
                    limit,
                    sortField,
                    sortOrder,
                })
            );
        }
    }, [dispatch, user, loggedInRoleId, page, limit]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(
                fetchUsers({
                    companyId: user?.companyId ?? undefined,
                    branchId: user?.branchId ?? undefined,
                    roleId: loggedInRoleId ?? undefined,
                    page: newPage,
                    limit,
                    sortField,
                    sortOrder,
                })
            );
        }
    };



    const [formDactaAddUser, setFormDataAddUser] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        gender: '',
        Designation: '',
        roleId: '',
        companyId: '',
        branchId: '',
        departmentId: '',
        joiningDate: '',
        birthDate: '',
        attendanceMode: '',
        shiftRotationalFixed: 'Fixed',
        workingShift: '',
        sendWhatsapp: '',
        geofencepoint: '',
        leaveTemplate: '',
        paymentMode: '',
        paymentDate: '',
        basicSalary: '',
        payrollTemplate: '',
        tempAddress: '',
        permenentAddress: '',
        bloodGroup: '',
        alternateMobileNO: '',
        pfNumber: '',
        reportingManagerId:''
    });

    const [formErrors, setFormErrors] = useState({
        firstName: "",
    });




    useEffect(() => {
        if (companyList.length > 0) {
            if (user?.companyId) {
                const loggedUsersCompany = companyList.find(
                    (company) => company.id === user.companyId
                );
                if (loggedUsersCompany) {
                    setAllCompany([loggedUsersCompany]);
                } else {
                    setAllCompany([]);
                }
            } else {
                // Super Admin — show all companies
                setAllCompany(companyList);
            }
        }

        if (branchList.length > 0) {
            if (user?.companyId) {
                const loggedUsersBranches = branchList.filter(
                    (branch) => branch.companyId === user.companyId
                );
                setAllBranches(loggedUsersBranches);
            } else {
                // Super Admin — show all branches
                setAllBranches(branchList);
            }
        } else {
            setAllBranches([]); // Explicitly empty if no branches exist at all
        }

    }, [branchList, companyList, user?.companyId]);

    useEffect(() => {
        if (formDactaAddUser.companyId !== '') {
            const branches = allBranches.filter(branch => branch.companyId === Number(formDactaAddUser.companyId));
            setFilteredBranches(branches);
        } else {
            setFilteredBranches([]);
        }
    }, [formDactaAddUser.companyId, allBranches]);

    useEffect(() => {
        const companyId = editUserData?.companyId;
        if (typeof companyId === "number") {
            const branches = allBranches.filter(branch => branch.companyId === companyId);
            setFilteredBranches(branches);
        } else {
            setFilteredBranches([]);
        }
    }, [editUserData?.companyId, allBranches]);

    const handleAddUserSubmit = async (e: any) => {
        e.preventDefault();

        const {
            firstName,
            lastName,
            contact,
            email,
            gender,
            Designation,
            roleId,
            companyId,
            branchId,
            departmentId,
            joiningDate,
            birthDate,
            attendanceMode,
            shiftRotationalFixed,
            workingShift,
            sendWhatsapp,
            geofencepoint,
            leaveTemplate,
            paymentMode,
            paymentDate,
            basicSalary,
            payrollTemplate,
            tempAddress,
            permenentAddress,
            bloodGroup,
            alternateMobileNO,
            pfNumber,
        } = formDactaAddUser;

        const newErrors: any = {};

        if (!firstName.trim()) newErrors.firstName = "First Name is required";
        if (!lastName.trim()) newErrors.lastName = "Lastname Name is required";
        if (!contact.trim()) newErrors.contact = "Contact is required";
        if (!email.trim()) newErrors.email = "Enail is required";
        if (!gender.trim()) newErrors.gender = "Gender is required";
        if (!Designation.trim()) newErrors.Designation = "Designation is required";
        if (!roleId.trim()) newErrors.roleId = "Role selection is required";
        if (!companyId.trim()) newErrors.companyId = "Company Selection is required";
        if (!departmentId.trim()) newErrors.departmentId = "Department Selection is required";

        setFormErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const payload = new FormData();
        Object.entries(formDactaAddUser).forEach(([key, value]) => {
            payload.append(key, value);
        });

        if (profilePhoto) {
            payload.append("profilePhoto", profilePhoto);
            console.log("profile photo appended @!@!@!@@!@!@!!!!!!!!!!@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@");

        }
        if (bankDetails) payload.append("bankDetails", bankDetails);
        if (adhaarCard) payload.append("adhaarCard", adhaarCard);
        if (panCard) payload.append("panCard", panCard);
        if (educationalQulif) payload.append("educationalQulif", educationalQulif);

        try {
            console.log(formDactaAddUser);

            const response = await axiosClient.post(ADD_NEW_USER, payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.status === 201) {
                toast('Success', response.data.message, 'success');
            }

        } catch (error: any) {
            toast('Error', error.response?.data?.message || 'An error occurred while adding the user.', 'danger');
            console.error("Error submitting form", error);
        }

    }

    const getCompanyNameById = (companyId: number | null | undefined): string => {
        const company = companyList.find((comp) => comp.id === companyId);
        return company ? company.name : 'Unknown Company';
    };

    const geBranchNameById = (branchId: number | null | undefined): string => {
        const brnch = branchList.find((branch) => branch.id === branchId);
        return brnch ? brnch.name : 'Unknown Branch';
    };

    const getRoleNameByRoleId = (roleId: number | null | undefined): string => {
        const role = roleList.find((role) => role.id === roleId);
        return role ? role.name : 'Unknown Role';
    }


    const handleExcelUpload = async () => {
        const startTime = performance.now(); // Start time in milliseconds

        const { companyId, branchId, departmentId, roleId } = uploadExcelSelectedFormData;

        if (!companyId || !branchId || !departmentId || !roleId) {
            alert("All fields are required.");
            return;
        }

        if (
            isNaN(Number(companyId)) ||
            isNaN(Number(branchId)) ||
            isNaN(Number(departmentId)) ||
            isNaN(Number(roleId))
        ) {
            alert("All IDs must be valid numbers.");
            return;
        }

        const file = uploadExcelFileData;
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            const errorRows: any[] = [];

            rows.forEach((row, index) => {
                const {
                    firstName,
                    lastName,
                    email,
                    contact,
                } = row;

                let error = '';

                if (!firstName || !lastName || !email || !contact) {
                    error = 'Required fields missing.';
                }


                if (error) {
                    errorRows.push({
                        Row: index + 2,
                        firstName,
                        lastName,
                        email,
                        contact,
                        Error: error,
                    });
                }
            });

            if (errorRows.length > 0) {
                generateErrorExcelUserUpload(errorRows);
                toast('Error', `Validation failed for ${errorRows.length} row(s). Error file downloaded.`, 'danger');

                const endTime = performance.now();
                const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
                toast('Time', `Upload process completed in ${timeTaken} seconds.`, 'info');

                return;
            }

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('companyId', String(uploadExcelSelectedFormData.companyId));
                formData.append('branchId', String(uploadExcelSelectedFormData.branchId));
                formData.append('departmentId', String(uploadExcelSelectedFormData.departmentId));
                formData.append('roleId', String(uploadExcelSelectedFormData.roleId));

                const response = await axiosClient.post(UPLOAD_USERS_EXCEL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    responseType: 'blob',
                });

                if (response.status === 200) {
                    toast('Success', response.data.message || 'Users uploaded successfully.', 'success');

                } else {
                    toast('Error', response.data?.message || 'Upload failed.', 'danger');
                }

            } catch (error: any) {
                const response = error.response;

                if (
                    response &&
                    response.status === 400 &&
                    response.data instanceof Blob &&
                    response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ) {
                    const blob = new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'errors.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    toast('Error', 'Validation failed. Error file downloaded.', 'danger');
                } else {
                    console.error(error);
                    toast('Error', response?.data?.message || 'Upload failed.', 'danger');
                }
            }

            const endTime = performance.now(); // End time
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Seconds
            toast('Time', `Upload process completed in ${timeTaken} seconds.`, 'info');
        };

        reader.readAsBinaryString(file);
    };


    const getSortedFilteredData = () => {
        let data = [...users];

        // Filter by companyId and branchId if present
        if (user?.companyId) {
            data = data.filter(u => u.companyId === user.companyId);
        }
        if (user?.branchId) {
            data = data.filter(u => u.branchId === user.branchId);
        }

        if (start && end) {
            data = data.filter(user =>
                moment(user.createdAt).isBetween(start, end, 'day', '[]')
            );
        }

        if (roleFilter > 0) {
            data = data.filter(user => user.roleId === roleFilter);
        }

        if (sortOption === 'Recently Added') {
            data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        } else if (sortOption === 'Ascending') {
            data.sort((a, b) => a.firstName.localeCompare(b.firstName));
        } else if (sortOption === 'Descending') {
            data.sort((a, b) => b.firstName.localeCompare(a.firstName));
        } else if (sortOption === 'Last Month') {
            const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
            const endOfLastMonth = moment().subtract(1, 'month').endOf('month');
            data = data.filter(user =>
                moment(user.createdAt).isBetween(startOfLastMonth, endOfLastMonth, 'day', '[]')
            );
        } else if (sortOption === 'Last 7 Days') {
            const last7Days = moment().subtract(6, 'days');
            data = data.filter(user =>
                moment(user.createdAt).isSameOrAfter(last7Days, 'day')
            );
        }

        return data;
    };

    const [salaryData, setSalaryData] = useState<SalaryData | null>(null);

    const fetchSalary = async () => {
        console.log("@@@@@@@@@@@@@", startDate, endDate, viewUserDetails?.id);

        if (!startDate || !endDate || !viewUserDetails?.id) return;

        try {
            const response = await axiosClient.post("/api/payments/calculate", {
                userId: viewUserDetails.id,
                startDate,
                endDate,
            });
            console.log(response);

            setSalaryData(response.data); // store for rendering
        } catch (error) {
            console.error("Salary calculation error:", error);
        }
    };

    useEffect(() => {
        fetchSalary();
    }, [startDate, endDate, viewUserDetails])

    
    useEffect(() => {
        if (user?.companyId) {
          dispatch(fetchCompanysUsersThunk(user.companyId));
        }
      }, [user]);

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                        <div className="my-auto mb-2">
                            <h2 className="mb-1">Employee Master</h2>
                            {/* <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">Administration</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Users
                                    </li>
                                </ol>
                            </nav> */}
                        </div>
                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                            <div className="me-2">
                                <div className="dropdown">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                    >
                                        <i className="ti ti-file-export me-1" />
                                        Export
                                    </Link>
                                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                <i className="ti ti-file-type-pdf me-1" />
                                                Export as PDF
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                <i className="ti ti-file-type-xls me-1" />
                                                Export as Excel{" "}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="d-flex flex-row gap-2">
                                <label
                                    className="btn d-flex align-items-center mb-0"
                                    data-bs-toggle="modal"
                                    data-inert={true}
                                    data-bs-target="#upload_excel_model"
                                    style={{ backgroundColor: 'rgb(255, 165, 0q )', border: 'rgb(255, 165, 0)' }}
                                >
                                    <i className="fa fa-upload me-2" />
                                    Upload Excel
                                </label>
                                {
                                    filteredLabels.includes('AddUser') &&
                                    <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-inert={true}
                                        data-bs-target="#add_users"
                                        className="btn btn-primary d-flex align-items-center"
                                    >
                                        <i className="ti ti-circle-plus me-2" />
                                        Add New Employee
                                    </Link>
                                }
                                <label className="btn btn-success d-flex align-items-center mb-0">
                                    <i className="fa fa-chart-simple me-2" />
                                    Organization Chart
                                </label>
                            </div>

                            {/* 
                            <div className="head-icons ms-2 mb-0">
                                <CollapseHeader />
                            </div> */}
                        </div>
                    </div>
                    {/* /Breadcrumb */}
                    {/* Performance Indicator list */}
                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h4>Employee List</h4>
                            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3 w-100">
                                {/* <div className='mx-3'>
                                    <select
                                        className='form-control me-3'
                                        onChange={(e) => setLimit(parseInt(e.target.value))}
                                        value={limit}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={200}>200</option>
                                        <option value={300}>300</option>
                                        <option value={400}>400</option>
                                        <option value={500}>500</option>
                                        <option value={1000}>1000</option>

                                    </select>
                                </div>
                                <div className="me-3">
                                    <div className="input-icon-end position-relative">
                                        <PredefinedDateRanges />
                                        <span className="input-icon-addon">
                                            <i className="ti ti-chevron-down" />
                                        </span>
                                    </div>
                                </div>
                                <div className="dropdown me-3">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                    >
                                        {getRoleNameByRoleId(roleFilter)}
                                    </Link>
                                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                                onClick={() => setRoleFilter(0)}
                                            >
                                                All
                                            </Link>
                                        </li>
                                        {
                                            filteredRoles.map(role => (
                                                <li key={role.id}>
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item rounded-1"
                                                        onClick={() => setRoleFilter(role.id)}
                                                    >
                                                        {role.name}
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div> */}


                                <div className='d-flex align-items-center' style={{ minWidth: '50%', fontSize: '16px' }}>
                                    <div className='emp-search-bar' style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '6px', width: '100%' }}>
                                        <i className='fas fa-search' style={{ padding: '0 0 0 12px' }}></i>
                                        <input style={{ minWidth: "320px", border: 'none', fontSize: '16px' }} type="text" value={employeeSearch} className="form-control me-2" placeholder="Search Employees..." onChange={(e) => setEmployeeSearch(e.target.value)} />
                                        {employeeSearch && <i className='fas fa-times' style={{ padding: '0 20px 0 0', cursor: 'pointer' }} onClick={() => setEmployeeSearch("")}></i>}
                                        <span style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.8)', height: '30px' }}></span>
                                        <div>
                                            <i className='fas fa-sliders-h' style={{ padding: '0 15px', color: 'rgba(0, 0, 0, 0.5)', cursor: 'pointer' }} data-bs-toggle="modal" data-inert={true} data-bs-target="#search_filters"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropdown me-3 ms-auto">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                    >
                                        Status
                                    </Link>
                                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                                onClick={() => setStatusFilter('All')}
                                            >
                                                All
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                                onClick={() => setStatusFilter('Active')}
                                            >
                                                Active
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                                onClick={() => setStatusFilter('Inactive')}
                                            >
                                                Inactive
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                {/* <div className="dropdown">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                    >
                                        Sort By : {sortOption}
                                    </Link>
                                    <ul className="dropdown-menu dropdown-menu-end p-3">
                                        {['Recently Added', 'Ascending', 'Descending', 'Last Month', 'Last 7 Days'].map((option) => (
                                            <li key={option}>
                                                <Link
                                                    to="#"
                                                    className="dropdown-item rounded-1"
                                                    onClick={() => handleSortChange(option)}
                                                >
                                                    {option}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div> */}
                            </div>
                        </div>
                        <div className="card-body p-3">
                            <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
                                <table className="table datanew table-bordered">
                                    <thead className="table-header">
                                        <tr>
                                            <th className='py-3' style={{ fontSize: '15px' }}>Employee ID</th>
                                            <th className='py-3' style={{ fontSize: '15px' }}>Employee Name</th>
                                            <th className='py-3' style={{ fontSize: '15px' }}>Contact</th>
                                            {/* <th className='py-3' style={{ fontSize: '15px' }}>Company</th> */}
                                            <th className='py-3' style={{ fontSize: '15px' }}>Branch</th>
                                            <th className='py-3' style={{ fontSize: '15px' }}>Department</th>
                                            <th className='py-3' style={{ fontSize: '15px' }}>Role</th>
                                            <th className='py-3' style={{ fontSize: '15px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            getSortedFilteredData().map(user => (
                                                <tr key={user.id}>
                                                    <td style={{ fontSize: '14px' }}>{user.id}</td>
                                                    <td style={{ fontSize: '14px' }}>{user.firstName + " " + user.lastName}</td>
                                                    <td style={{ fontSize: '14px' }}>{user.contact}</td>
                                                    {/* <td>{getCompanyNameById(user.companyId)}</td> */}
                                                    <td style={{ fontSize: '14px' }}>{geBranchNameById(user.branchId)}</td>
                                                    <td style={{ fontSize: '14px' }}>{user.departmentId}</td>
                                                    <td style={{ fontSize: '14px' }}>{getRoleNameByRoleId(user.roleId) || "**"}</td>
                                                    <td>
                                                        <div className="action-icon d-inline-flex">
                                                            <Link to="#" onClick={() =>
                                                                setViewUserDetails(user)
                                                            } className="me-2" data-bs-toggle="modal" data-bs-target="#user_detail">
                                                                <i className="ti ti-eye" style={{ fontSize: '20px' }} />
                                                            </Link>
                                                            <Link
                                                                to="#"
                                                                className="me-2"
                                                                data-bs-toggle="modal"
                                                                data-inert={true}
                                                                onClick={() => setEditUserData(user)}
                                                                data-bs-target="#edit_user"
                                                            >
                                                                <i className="ti ti-edit" style={{ fontSize: '20px' }} />
                                                            </Link>
                                                            <Link to="#" data-bs-toggle="modal" data-inert={true} data-bs-target="#delete_modal">
                                                                <i className="ti ti-trash" style={{ fontSize: '20px' }} />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>

                                {/* Pagination Style 1 */}
                                <div className="col-xl-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <nav aria-label="Page navigation" className="pagination-style-1 d-flex justify-content-center">
                                                <ul className="pagination mb-0">

                                                    {/* Previous button */}
                                                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                                                            <i className="fas fa-angle-left align-middle" />
                                                        </button>
                                                    </li>

                                                    {/* Show page numbers around current */}
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                        .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                                                        .map((p, idx, arr) => {
                                                            const prev = arr[idx - 1];
                                                            return (
                                                                <>
                                                                    {prev && p - prev > 1 && (
                                                                        <li className="page-item disabled"><span className="page-link">...</span></li>
                                                                    )}
                                                                    <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                                                                        <button className="page-link" onClick={() => handlePageChange(p)}>{p}</button>
                                                                    </li>
                                                                </>
                                                            );
                                                        })}

                                                    {/* Next button */}
                                                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                                                            <i className="fas fa-angle-right align-middle" />
                                                        </button>
                                                    </li>

                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>

                                {/* /Pagination Style 1 */}
                            </div>





                        </div>

                    </div>
                    {/* /Performance Indicator list */}
                </div>
                <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
                    <p className="mb-0">2014 - 2025 © SmartHR.</p>
                    <p>
                        Designed &amp; Developed By{" "}
                        <Link to="#" className="text-primary">
                            Dreams
                        </Link>
                    </p>
                </div>
            </div >
            {/* /Page Wrapper */}
            {/* search filters popup */}
            <div className="modal fade" id="search_filters">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Apply Search Filters</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>

                        {/* filters */}
                        <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.8)' }}>
                            <div className='mb-2' style={{ padding: '10px 20px 0' }}>
                                <div className='d-flex align-items-center justify-content-between mb-1'>
                                    <label style={{ fontSize: '16px', color: 'black', fontWeight: '500' }}>Filter Branch</label>
                                    <button onClick={() => branch.length === 0 ? setBranch([...branchOptions]) : setBranch([])} style={{ background: 'none', outline: 'none', border: 'none', padding: '0', margin: '0', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>{branch.length === 0 ? 'Select All' : 'Unselect All'}</button>
                                </div>
                                <div className='d-flex align-items-center flex-wrap'>
                                    {branchOptions.map(option => (
                                        <label key={option} className="checkbox-label d-flex align-items-center me-5 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={branch.includes(option)}
                                                onChange={() => handleToggle(option, 'branch', setBranch, branch)}
                                            />
                                            <span className='ms-1'>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className='mb-2' style={{ padding: '10px 20px 0' }}>
                                <div className='d-flex align-items-center justify-content-between mb-1'>
                                    <label style={{ fontSize: '16px', color: 'black', fontWeight: '500' }}>Filter Department</label>
                                    <button onClick={() => department.length === 0 ? setDepartment([...departmentOptions]) : setDepartment([])} style={{ background: 'none', outline: 'none', border: 'none', padding: '0', margin: '0', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>{department.length === 0 ? 'Select All' : 'Unselect All'}</button>
                                </div>
                                <div className='d-flex align-items-center flex-wrap'>
                                    {departmentOptions.map(option => (
                                        <label key={option} className="checkbox-label  d-flex align-items-center me-5 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={department.includes(option)}
                                                onChange={() => handleToggle(option, 'department', setDepartment, department)}
                                            />
                                            <span className='ms-1'>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className='mb-2' style={{ padding: '10px 20px 0' }}>
                                <div className='d-flex align-items-center justify-content-between mb-1'>
                                    <label style={{ fontSize: '16px', color: 'black', fontWeight: '500' }}>Filter Active Status</label>
                                    <button onClick={() => activeInactive.length === 0 ? setActiveInactive([...activeInactiveOptions]) : setActiveInactive([])} style={{ background: 'none', outline: 'none', border: 'none', padding: '0', margin: '0', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>{activeInactive.length === 0 ? 'Select All' : 'Unselect All'}</button>
                                </div>
                                <div className='d-flex align-items-center flex-wrap'>
                                    {activeInactiveOptions.map(option => (
                                        <label key={option} className="checkbox-label d-flex align-items-center me-5 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={activeInactive.includes(option)}
                                                onChange={() => handleToggle(option, 'activeInactive', setActiveInactive, activeInactive)}
                                            />
                                            <span className='ms-1'>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className='mb-2' style={{ padding: '10px 20px 0' }}>
                                <div className='d-flex align-items-center justify-content-between mb-1'>
                                    <label style={{ fontSize: '16px', color: 'black', fontWeight: '500' }}>Filter Shift Timing</label>
                                    <button onClick={() => shiftTiming.length === 0 ? setShiftTiming([...shiftTimingOptions]) : setShiftTiming([])} style={{ background: 'none', outline: 'none', border: 'none', padding: '0', margin: '0', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>{shiftTiming.length === 0 ? 'Select All' : 'Unselect All'}</button>
                                </div>
                                <div className='d-flex align-items-center flex-wrap'>
                                    {shiftTimingOptions.map(option => (
                                        <label key={option} className="checkbox-label d-flex align-items-center me-5 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={shiftTiming.includes(option)}
                                                onChange={() => handleToggle(option, 'shiftTiming', setShiftTiming, shiftTiming)}
                                            />
                                            <span className='ms-1'>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Add Users */}
            <div className="modal fade" id="add_users">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add User</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={(e) => handleAddUserSubmit(e)}>
                            <div className="modal-body pb-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                <Tabs style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <TabList>
                                        <Tab>Personal Info</Tab>
                                        <Tab>Attendance Info</Tab>
                                        <Tab>Salary Info</Tab>
                                        <Tab>Other Info</Tab>
                                    </TabList>

                                    {/* --- Tab 1 --- */}
                                    <TabPanel>
                                        <div className="row" style={{ minHeight: '300px' }}>
                                            <div className="col-md-12">
                                                <div className="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4">
                                                    <div className="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames">
                                                        <ImageWithBasePath
                                                            src="assets/img/profiles/avatar-30.jpg"
                                                            alt="img"
                                                            className="rounded-circle"
                                                        />
                                                    </div>
                                                    <div className="profile-upload">
                                                        <div className="mb-2">
                                                            <h6 className="mb-1">Select Image</h6>
                                                            <p className="fs-12">Image should be below 4 mb</p>
                                                        </div>
                                                        <div className="profile-uploader d-flex align-items-center">
                                                            <div className={`drag-upload-btn btn btn-sm btn-primary me-2`}>
                                                                Upload
                                                                <input
                                                                    type="file"
                                                                    name='companyImage'
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) setProfilePhoto(file);
                                                                    }}
                                                                    className="form-control image-sign"
                                                                />
                                                            </div>
                                                            <Link
                                                                to="#"
                                                                className="btn btn-light btn-sm"
                                                            >
                                                                Cancel
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formDactaAddUser.firstName}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, firstName: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formDactaAddUser.lastName}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, lastName: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formDactaAddUser.contact}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, contact: e.target.value })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={formDactaAddUser.email}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, email: e.target.value })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Gender</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.gender}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, gender: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Designation</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formDactaAddUser.Designation}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, Designation: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Role</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.roleId}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, roleId: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select Role</option>
                                                    {filteredRoles.map((role) => (
                                                        <option key={role.id} value={role.id}>
                                                            {role.name}-{getCompanyNameById(role.companyId)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Company</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.companyId}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, companyId: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select Company</option>
                                                    {allcompany.map((company) => (
                                                        <option key={company.id} value={company.id}>
                                                            {company.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Branch</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.branchId}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, branchId: e.target.value })
                                                    }
                                                    disabled={formDactaAddUser.companyId === ""}
                                                >
                                                    <option value="">Select branch</option>
                                                    {filteredBranches.map((branch) => (
                                                        <option key={branch.id} value={branch.id}>
                                                            {branch.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Department</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.departmentId}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, departmentId: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    {
                                                        filteredDepartments.map(dept => (
                                                            <option value={dept.id} key={dept.id}>{dept.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3 position-relative">
                                                <label className="form-label">Reporting Manager</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={searchText}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setSearchText(val);
                                                        setShowDropdown(true);
                                                    }}
                                                    onBlur={() => {
                                                        setTimeout(() => setShowDropdown(false), 500); // delay to allow selection
                                                    }}
                                                    onFocus={() => setShowDropdown(true)}
                                                    placeholder="Search employee..."
                                                />
                                                {showDropdown && (
                                                    <ul className="dropdown-menu show w-100" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                        {companyUserList
                                                            .filter(emp =>
                                                                `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchText.toLowerCase())
                                                            )
                                                            .map(emp => (
                                                                <li key={emp.id}>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormDataAddUser({ ...formDactaAddUser, reportingManagerId: emp.id.toString() });
                                                                            setSearchText(`${emp.firstName} ${emp.lastName}`);
                                                                            setShowDropdown(false);
                                                                        }}
                                                                    >
                                                                        {emp.firstName} {emp.lastName}
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        {companyUserList.length === 0 && (
                                                            <li className="dropdown-item text-muted">No employees</li>
                                                        )}
                                                    </ul>
                                                )}
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Joining Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={formDactaAddUser.joiningDate}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, joiningDate: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Birth Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={formDactaAddUser.birthDate}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, birthDate: e.target.value })
                                                    }
                                                />
                                            </div>

                                            {/* <div className="col-md-6 mb-3">
                                                <label className="form-label">Marital Status</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.maritalStatus}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, maritalStatus: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="single">Single</option>
                                                    <option value="married">Married</option>
                                                    <option value="unmarried">Unmarried</option>
                                                </select>
                                            </div> */}



                                            {/* <div className="col-md-6 mb-3">
                                                <label className="form-label">Password</label>
                                                <div className="pass-group">
                                                    <input
                                                        type={passwordVisibility.password ? "text" : "password"}
                                                        className="form-control"
                                                        value={formDactaAddUser.password}
                                                        onChange={(e) =>
                                                            setFormDataAddUser({ ...formDactaAddUser, password: e.target.value })
                                                        }
                                                    />
                                                    <span
                                                        className={`ti toggle-passwords ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"}`}
                                                        onClick={() => togglePasswordVisibility("password")}
                                                    ></span>
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Confirm Password</label>
                                                <div className="pass-group">
                                                    <input
                                                        type={passwordVisibility.confirmPassword ? "text" : "password"}
                                                        className="form-control"
                                                        value={formDactaAddUser.confirmPassword}
                                                        onChange={(e) =>
                                                            setFormDataAddUser({ ...formDactaAddUser, confirmPassword: e.target.value })
                                                        }
                                                    />
                                                    <span
                                                        className={`ti toggle-passwords ${passwordVisibility.confirmPassword ? "ti-eye" : "ti-eye-off"}`}
                                                        onClick={() => togglePasswordVisibility("confirmPassword")}
                                                    ></span>
                                                </div>
                                            </div> */}
                                        </div>
                                    </TabPanel>

                                    {/* --- Tab 2 --- */}
                                    <TabPanel>
                                        <div className="row" style={{ minHeight: '300px' }}>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Atterdance mode</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.attendanceMode}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, attendanceMode: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Month">Manual</option>
                                                    <option value="Day">Biometric</option>
                                                    <option value="Hour">Geofence point</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Shift (Rotational/fixed)</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.shiftRotationalFixed}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, shiftRotationalFixed: e.target.value })
                                                    }
                                                >
                                                    <option value="Fixed">Fixed</option>
                                                    <option value="Rotational">Rotational</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Working Shift</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.workingShift}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, workingShift: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    {
                                                        allShifts.map(shift => (
                                                            <option value={shift.id} key={shift.id}>{shift.shiftName}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Send Attendance to WhatsApp</label>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="sendWhatsapp"
                                                        id="sendWhatsappYes"
                                                        value="yes"
                                                        checked={formDactaAddUser.sendWhatsapp === 'yes'}
                                                        onChange={(e) =>
                                                            setFormDataAddUser({ ...formDactaAddUser, sendWhatsapp: e.target.value })
                                                        }
                                                    />
                                                    <label className="form-check-label" htmlFor="sendWhatsappYes">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="sendWhatsapp"
                                                        id="sendWhatsappNo"
                                                        value="no"
                                                        checked={formDactaAddUser.sendWhatsapp === 'no'}
                                                        onChange={(e) =>
                                                            setFormDataAddUser({ ...formDactaAddUser, sendWhatsapp: e.target.value })
                                                        }
                                                    />
                                                    <label className="form-check-label" htmlFor="sendWhatsappNo">
                                                        No
                                                    </label>
                                                </div>
                                            </div>



                                            {/* <div className="col-md-6 mb-3">
                                                <label className="form-label">Face Scan/Biometric Device</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.biometricDevice}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, biometricDevice: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Device 1">Device 1</option>
                                                    <option value="Device 2">Device 2</option>
                                                    <option value="Device 3">Device 3</option>

                                                </select>
                                            </div> */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Geofence point</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.geofencepoint}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, geofencepoint: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Location 1">Location 1</option>
                                                    <option value="Location 2">Location 2</option>
                                                    <option value="Location 3">Location 3</option>

                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Leave Template</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.leaveTemplate}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, leaveTemplate: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    {
                                                        allLeaveTemplates.map(leaveTemp => (
                                                            <option value={leaveTemp.id}>{leaveTemp.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                        </div>
                                    </TabPanel>


                                    {/* --- Tab 3 --- */}
                                    <TabPanel>
                                        <div className="row" style={{ minHeight: '300px' }}>


                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Payment mode</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.paymentMode}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, paymentMode: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Month">Month</option>
                                                    <option value="Day">Day</option>
                                                    <option value="Hour">Hour</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Payment Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={formDactaAddUser.paymentDate}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, paymentDate: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Earning (Gross)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formDactaAddUser.basicSalary}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, basicSalary: e.target.value })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Payroll Template</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.payrollTemplate}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, payrollTemplate: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    {
                                                        allPayrollTemp.map(template => (
                                                            <option value={template.id} key={template.id}>{template.templateName}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                        </div>
                                    </TabPanel>

                                    {/* --- Tab 4 --- */}
                                    <TabPanel>
                                        <div className="row" style={{ minHeight: '300px' }}>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Temperary Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formDactaAddUser.tempAddress}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, tempAddress: e.target.value })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Permenant Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formDactaAddUser.permenentAddress}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, permenentAddress: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Blood Group</label>
                                                <select
                                                    className="form-control"
                                                    value={formDactaAddUser.bloodGroup}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, bloodGroup: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A−</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B−</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB−</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O−</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">ALternate Mobile Number</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formDactaAddUser.alternateMobileNO}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, alternateMobileNO: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">PF Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formDactaAddUser.pfNumber}
                                                    onChange={(e) =>
                                                        setFormDataAddUser({ ...formDactaAddUser, pfNumber: e.target.value })
                                                    }
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Bank Dtails</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setBankDetails(file);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Adhaar Card</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setAdhaarCard(file);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">PAN Card</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setPanCard(file);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Educational Qualification</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setEducationalQulif(file);
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-white border me-2"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add User
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            {/* /Add Users */}
            {/* Edit  Users */}
            <div className="modal fade" id="edit_user">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit User</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={(e) => handleEditUserSubmit(e)}>
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">First Name</label>
                                            <input
                                                type="text"
                                                onChange={(e) => handleEditDataChange(e)}
                                                name='firstName'
                                                value={editUserData?.firstName}
                                                className="form-control"
                                                defaultValue="Anthony "
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                type="text"
                                                onChange={(e) => handleEditDataChange(e)}
                                                name='lastName'
                                                value={editUserData?.lastName}
                                                className="form-control"
                                                defaultValue=" Lewis"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                onChange={(e) => handleEditDataChange(e)}
                                                name='email'
                                                value={editUserData?.email}
                                                className="form-control"
                                                defaultValue="anthony@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="text"
                                                onChange={(e) => handleEditDataChange(e)}
                                                name='contact'
                                                value={editUserData?.contact}
                                                className="form-control"
                                                defaultValue={988765544}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Merital Status</label>
                                            <select
                                                value={editUserData?.maritalStatus ?? ""}
                                                className="form-control"
                                                onChange={(e) => handleEditDataChange(e)}
                                                name='maritalStatus'
                                            >
                                                <option value=''>Select Marital Status</option>
                                                <option value="single">Single</option>
                                                <option value="married">Married</option>
                                                <option value="Unmarried">Unmarried</option>

                                            </select>
                                        </div>
                                    </div> */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Role</label>
                                            <select
                                                className='form-control'
                                                value={editUserData?.roleId}
                                                name='roleId'
                                                onChange={(e) => handleEditDataChange(e)}
                                            >
                                                {
                                                    filteredRoles.map(role => (
                                                        <option key={role.id} value={role.id}>{role.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Birth Date</label>
                                            <input
                                                type="date"
                                                onChange={(e) => handleEditDataChange(e)}
                                                name="birthDate"
                                                value={editUserData?.birthDate?.split("T")[0] || ""}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Company</label>
                                            <select
                                                className="form-control"
                                                value={editUserData?.companyId ?? ""}
                                                name="companyId"
                                                onChange={(e) => handleEditDataChange(e)}
                                            >
                                                <option value="">Select Company</option>
                                                {allcompany.map(company => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Branch</label>
                                            <select
                                                className="form-control"
                                                value={editUserData?.branchId ?? ""}
                                                name="branchId"
                                                onChange={(e) => handleEditDataChange(e)}
                                            >
                                                <option value="">Select Branch</option>
                                                {filteredBranches.map(branch => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Department</label>
                                            <select
                                                className='form-control'
                                                name='departmentId'
                                                value={editUserData?.departmentId}
                                                onChange={(e) => handleEditDataChange(e)}
                                            >
                                                <option value="">---Select ---</option>
                                                {
                                                    filteredDepartments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Password</label>
                                            <div className="pass-group">
                                                <input
                                                    type={
                                                        passwordVisibility.password
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    onChange={(e) => handleEditDataChange(e)}
                                                    name='password'
                                                    className="pass-input form-control"
                                                />
                                                <span
                                                    className={`ti toggle-passwords ${passwordVisibility.password
                                                        ? "ti-eye"
                                                        : "ti-eye-off"
                                                        }`}
                                                    onClick={() =>
                                                        togglePasswordVisibility("password")
                                                    }
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Confirm Password</label>
                                            <div className="pass-group">
                                                <input
                                                    type={
                                                        passwordVisibility.confirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className="pass-inputs form-control"
                                                    onChange={(e) => handleEditDataChange(e)}
                                                    name='confirmPassword'
                                                />
                                                <span
                                                    className={`ti toggle-passwords ${passwordVisibility.confirmPassword
                                                        ? "ti-eye"
                                                        : "ti-eye-off"
                                                        }`}
                                                    onClick={() =>
                                                        togglePasswordVisibility("confirmPassword")
                                                    }
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Select Payroll Template <span className="text-danger"> *</span>
                                            </label>
                                            <select
                                                name='templateId'
                                                value={editUserData?.payrollTemplate ?? ''}
                                                className='form-control'
                                                onChange={(e) => handleEditDataChange(e)}
                                            >
                                                <option value="">--Select Template--</option>
                                                {
                                                    allPayrollTemp.map(template => (
                                                        <option value={template.id} key={template.id}>{template.templateName}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-white border me-2"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button type="submit" data-bs-dismiss="modal" className="btn btn-primary">
                                    Save Details
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Edit  Users */}
            {/* user Detail */}
            <div className="modal fade" id="user_detail">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">User Details</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="moday-body">
                            <Tabs style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <TabList>
                                    <Tab>Personal Info</Tab>
                                    <Tab>Attendance</Tab>
                                    <Tab>salary</Tab>
                                </TabList>

                                <TabPanel>
                                    <div className="p-3">
                                        <div className="d-flex justify-content-between align-items-center rounded bg-light p-3">
                                            <div className="file-name-icon d-flex align-items-center">
                                                <div>
                                                    <p className="text-gray-9 fw-medium mb-0">
                                                        {viewUserDetails?.firstName} {viewUserDetails?.lastName}
                                                    </p>
                                                    <p>{viewUserDetails?.email}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-gray-9 fw-medium">Basic Info</p>
                                        <div className="pb-1 border-bottom mb-4">
                                            <div className="row align-items-center">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <p className="fs-12 mb-0">Phone Number</p>
                                                        <p className="text-gray-9">{viewUserDetails?.contact}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <p className="fs-12 mb-0">Role</p>
                                                        <p className="text-gray-9">{getRoleNameByRoleId(viewUserDetails?.roleId)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <p className="fs-12 mb-0">Company</p>
                                                        <p className="text-gray-9">{getCompanyNameById(viewUserDetails?.companyId)}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <p className="fs-12 mb-0">Branch</p>
                                                        <p className="text-gray-9">{geBranchNameById(viewUserDetails?.branchId)}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <p className="fs-12 mb-0">Birth Date</p>
                                                        <p className="text-gray-9">
                                                            {formatDate(viewUserDetails?.birthDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <p className="fs-12 mb-0">Created Date</p>
                                                        <p className="text-gray-9">
                                                            {formatDate(viewUserDetails?.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-4">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Merital Status</p>
                                                <p className="text-gray-9">
                                                    {viewUserDetails?.maritalStatus}
                                                </p>
                                            </div>
                                        </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <table className="table datanew table-bordered">
                                            <thead className="table-header">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Allowed Leaves</th>
                                                    <th>Taken Leaves</th>
                                                    <th>Balance Leaves</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>Paid Leaves</th>
                                                    <td>{userLeaveStats.allowed.paidLeaveQuota}</td>
                                                    <td>{userLeaveStats.taken.paidLeavesTaken}</td>
                                                    <td>{userLeaveStats.balance.paidLeaveBalance}</td>
                                                </tr>
                                                <tr>
                                                    <th>Casual Leaves</th>
                                                    <td>{userLeaveStats.allowed.casualLeaveQuota}</td>
                                                    <td>{userLeaveStats.taken.casualLeavesTaken}</td>
                                                    <td>{userLeaveStats.balance.casualLeaveBalance}</td>
                                                </tr>
                                                <tr>
                                                    <th> Sick Leaves</th>
                                                    <td>{userLeaveStats.allowed.sickLeaveQuota}</td>
                                                    <td>{userLeaveStats.taken.sickLeavesTaken}</td>
                                                    <td>{userLeaveStats.balance.sickLeaveBalance}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </TabPanel>

                                <TabPanel>
                                    <div className="container mt-1">

                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                style={{ maxWidth: "200px" }}
                                            />

                                            <input
                                                type="date"
                                                className="form-control"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                style={{ maxWidth: "200px" }}
                                            />

                                            <button
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    exportAttendanceLogsToPDF(
                                                        logs,
                                                        getCompanyNameById(viewUserDetails?.companyId),
                                                        geBranchNameById(viewUserDetails?.branchId),
                                                        (viewUserDetails?.firstName + " " + viewUserDetails?.lastName) || "",
                                                        startDate,
                                                        endDate,
                                                        attendanceSummary
                                                    )
                                                }
                                            >
                                                Download PDF
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <div
                                            style={{
                                                width: "100%",
                                                maxWidth: "100%",
                                                height: "300px",
                                                overflow: "auto",
                                            }}
                                        >
                                            <table className="table datanew table-bordered">
                                                <thead className="table-header">
                                                    <tr>
                                                        <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Date</th>
                                                        <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Day</th>
                                                        <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Status</th>
                                                        <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Working Hrs</th>
                                                        <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Overtime Hrs</th>
                                                        <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Check In</th>
                                                        <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Check Out</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {logs.map((log, index) => (
                                                        <tr key={index}>
                                                            <td>{formatToDDMonthNameYYYY(log.date)}</td>
                                                            <td>{log.day}</td>
                                                            <td>{log.status}</td>
                                                            <td>{log.workingHours}</td>
                                                            <td>{log.overtimeHours}</td>
                                                            <td>{log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : "-"}</td>
                                                            <td>{log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : "-"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* ✅ Attendance Summary Below Table */}
                                        {attendanceSummary && (
                                            <div className="mt-4">
                                                <h5>Attendance Summary</h5>
                                                <table className="table table-bordered w-auto">
                                                    <tbody>
                                                        <tr>
                                                            <th>Total Days</th>
                                                            <td>{attendanceSummary.totalDays}</td>
                                                            <th>Working Days</th>
                                                            <td>{attendanceSummary.workingDays}</td>
                                                            <th>Present Days</th>
                                                            <td>{attendanceSummary.presentDays}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Half Days</th>
                                                            <td>{attendanceSummary.halfDayCount}</td>
                                                            <th>Paid Leave</th>
                                                            <td>{attendanceSummary.paidLeaveDays}</td>
                                                            <th>Unpaid Leave</th>
                                                            <td>{attendanceSummary.unpaidLeaveDays}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Holidays</th>
                                                            <td>{attendanceSummary.holidays}</td>
                                                            <th>Weekly Offs</th>
                                                            <td>{attendanceSummary.weeklyOffs}</td>
                                                            <th>Absent Days</th>
                                                            <td>{attendanceSummary.absentDays}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Total Hours Worked</th>
                                                            <td>{attendanceSummary.totalHoursWorked}</td>
                                                            <th>Overtime Hours</th>
                                                            <td>{attendanceSummary.totalOvertimeWorked}</td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>

                                <TabPanel>
                                    <div className="container mt-1">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                style={{ maxWidth: "200px" }}
                                            />
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                style={{ maxWidth: "200px" }}
                                            />
                                        </div>

                                        {salaryData && (
                                            <div className="mt-4">
                                                <h5>Salary Details for: {salaryData.name}</h5>
                                                <table className="table table-bordered w-auto mt-3">
                                                    <tbody>
                                                        <tr>
                                                            <th>Basic Salary</th>
                                                            <td>₹ {salaryData.basicSalary}</td>
                                                            <th>Payment Mode</th>
                                                            <td>{salaryData.paymentMode}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Per Day Rate</th>
                                                            <td>{salaryData.perDayRate}</td>
                                                            <th>Hourly Rate</th>
                                                            <td>{salaryData.hourlyRate}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Eligible Paid Days</th>
                                                            <td>{salaryData.eligiblePaidDays}</td>
                                                            <th>Total Hours Worked</th>
                                                            <td>{salaryData.totalHoursWorked}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Gross Pay</th>
                                                            <td>₹ {salaryData.grossPay}</td>
                                                            <th>Allowances</th>
                                                            <td>₹ {salaryData.allowanceTotal}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Bonuses</th>
                                                            <td>₹ {salaryData.bonusTotal}</td>
                                                            <th>Deductions</th>
                                                            <td>₹ {salaryData.deductionTotal}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Final Pay</th>
                                                            <td colSpan={3}>
                                                                <strong>₹ {salaryData.finalPay}</strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                {/* 🧾 Payroll Components Breakdown */}
                                                <h6>Payroll Components</h6>
                                                <table className="table table-striped table-bordered w-auto">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Type</th>
                                                            <th>Amount Type</th>
                                                            <th>Value</th>
                                                            <th>Calculated Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {salaryData.payrollComponentsBreakdown.map((comp, i) => (
                                                            <tr key={i}>
                                                                <td>{comp.name}</td>
                                                                <td>{comp.type}</td>
                                                                <td>{comp.amountType}</td>
                                                                <td>{comp.value}</td>
                                                                <td>₹ {comp.calculatedAmount}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                {/* ✅ Download Button */}
                                                <div className="mt-4">
                                                    <SalarySlip salaryData={salaryData} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>


                            </Tabs>

                        </div>
                    </div>
                </div>
            </div >
            {/* /user Detail */}





            {/* /Upload Bulk Empp Data */}
            <div className="modal fade" id="upload_excel_model">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Upload Excel Data</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body pb-0">
                            <div className="mb-3">
                                <label className="form-label">Select Company</label>
                                <select
                                    className="form-select"
                                    onChange={(e) =>
                                        setUploadExcelSelectedFormData({ ...uploadExcelSelectedFormData, companyId: e.target.value })
                                    }
                                >
                                    <option value="">--Select--</option>
                                    {
                                        allcompany.map(company => (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Select Branch</label>
                                <select
                                    className="form-select"
                                    onChange={(e) =>
                                        setUploadExcelSelectedFormData({ ...uploadExcelSelectedFormData, branchId: e.target.value })
                                    }
                                >
                                    <option value="">--Select--</option>{
                                        allBranches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Select Role</label>
                                <select
                                    className="form-select"
                                    onChange={(e) =>
                                        setUploadExcelSelectedFormData({ ...uploadExcelSelectedFormData, roleId: e.target.value })
                                    }
                                >
                                    <option value="">--Select--</option>
                                    {
                                        filteredRoles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Select Department</label>
                                <select
                                    className="form-select"
                                    onChange={(e) =>
                                        setUploadExcelSelectedFormData({ ...uploadExcelSelectedFormData, departmentId: e.target.value })
                                    }
                                >
                                    <option value="">--Select--</option>
                                    {
                                        filteredDepartments.map(department => (
                                            <option key={department.id} value={department.id}>{department.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Select Excel File</label>
                                <input
                                    type="file"
                                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    className="form-control"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const isExcel =
                                                file.type === "application/vnd.ms-excel" ||
                                                file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                                            if (!isExcel) {
                                                alert("Please upload a valid Excel file (.xls or .xlsx)");
                                                return;
                                            }
                                            setUploadExcelFileData(file);
                                        }
                                    }}
                                />

                            </div>

                            <div className="text-center">
                                <button
                                    type='button'
                                    onClick={handleExcelUpload}
                                    className="btn btn-primary"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            {/* /Upload Bulk Empp Data */}
        </>

    )
}


export default Users

