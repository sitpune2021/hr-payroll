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
import { ADD_NEW_USER, EDIT_USER, UPLOAD_USERS_EXCEL } from '../../../axiosConfig/apis';
import { Company } from '../../../core/data/redux/companySlice';
import { Branch } from '../../../core/data/redux/branchesSlice';
import { fetchUsers, setSort, User } from '../../../core/data/redux/usersSlice';
import { formatDate } from '../../../utils/dateformatter1';
import { generateErrorExcelUserUpload } from '../../../utils/generateErrorExcelUploadUser';
import { Department } from '../../../core/data/redux/departmentsSlice';
import moment from 'moment';
type PasswordField = "password" | "confirmPassword";

const Users = () => {

    const dispatch = useAppDispatch();
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOption, setSortOption] = useState('Last 7 Days');
    const [roleFilter, setRoleFilter] = useState(0)


    const handleSortChange = (option: string) => {
        setSortOption(option);
    };

    const userAllowedLabels = useSelector((state: RootState) => state.feature.allowedFeatures);
    const filteredLabels = userAllowedLabels.map((feature: any) => feature.name);

    const [viewUserDetails, setViewUserDetails] = useState<User>();
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
    const filteredRoles = loggedInRoleId !== undefined
        ? roles.filter(role => role.id > loggedInRoleId)
        : [];


    const [allcompany, setAllCompany] = useState<Company[]>([])
    const [allBranches, setAllBranches] = useState<Branch[]>([])
    const [limit, setLimit] = useState(10)
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
    const user = useSelector((state: RootState) => state.auth.user);
    const companyList = useAppSelector((state) => state.companies.list);
    const branchList: Branch[] = useSelector((state: RootState) => state.branches.branches);
    const departmentList = useSelector((state: RootState) => state.departments.data)
    const { start, end } = useSelector((state: any) => state.dateRange);
    const roleList = useAppSelector((state: RootState) => state.roles.list);



    useEffect(() => {
        if (user && user.departmentId === 1) {
            setFilteredDepartments(departmentList)
        } else if (user && user.departmentId !== null) {
            const filtered = departmentList.filter(dept => dept.id > user.departmentId!);
            setFilteredDepartments(filtered);
        } else {
            setFilteredDepartments([]);
        }
    }, [user, departmentList]);



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
        email: '',
        password: '',
        confirmPassword: '',
        contact: '',
        birthDate: '',
        roleId: '',
        maritalStatus: '',
        companyId: '',
        branchId: '',
        departmentId: ''
    });




    useEffect(() => {
        if (companyList.length > 0) {
            const loggedUsersCompany = companyList.find(
                (company) => company.id === user?.companyId
            );

            if (loggedUsersCompany) {
                setAllCompany([loggedUsersCompany]);
            } else {
                setAllCompany(companyList);
            }
        }

        if (branchList.length > 0) {
            const loggedUsersBranches = branchList.filter(
                (branch) => branch.companyId === user?.companyId
            );

            if (loggedUsersBranches.length > 0) {
                setAllBranches(loggedUsersBranches);
            } else {
                setAllBranches(branchList);
            }
        }


    }, [branchList, companyList, user?.companyId]);

    useEffect(() => {
        if (formDactaAddUser.companyId) {
            const branches = allBranches.filter(branch => branch.companyId === parseInt(formDactaAddUser.companyId));
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
            email,
            password,
            confirmPassword,
            contact,
            birthDate,
            roleId,
            maritalStatus,
            companyId,
            branchId,
            departmentId
        } = formDactaAddUser;

        if (!companyId) {
            toast('Error', 'Company is required.', 'danger');
            return;
        }


        if (parseInt(roleId) >= 3 && !branchId) {
            toast('Error', 'Branch is required for selected role.', 'danger');
            return;
        }

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            toast('Error', 'Please fill all required fields.', 'danger');

            return;
        }

        if (password !== confirmPassword) {
            toast('Error', 'Password did not match.', 'danger');
            return;
        }

        if (!departmentId) {
            toast('Error', 'Department is mendatory.', 'danger');
            return;
        }


        try {
            const response = await axiosClient.post(ADD_NEW_USER, {
                firstName,
                lastName,
                email,
                password,
                contact,
                birthDate,
                roleId,
                maritalStatus,
                companyId,
                branchId,
                departmentId
            }
            )
            if (response.status === 200) {
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

    const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const startTime = performance.now(); // Start time in milliseconds

        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            const errorRows: any[] = [];
            const validUsers: any[] = [];

            const loggedInUser = user;
            const loggedInRoleName = loggedInUser?.role;
            const loggedInRoleId = roleList.find(role => role.name === loggedInRoleName)?.id;

            rows.forEach((row, index) => {
                const {
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword,
                    contact,
                    birthDate,
                    roleId,
                    maritalStatus,
                    companyId,
                    branchId,
                    departmentId
                } = row;

                let error = '';

                if (!firstName || !lastName || !email || !password || !confirmPassword || !departmentId) {
                    error = 'Required fields missing.';
                } else if (password !== confirmPassword) {
                    error = 'Passwords do not match.';
                } else if (!companyId) {
                    error = 'Company ID is required.';
                } else if (parseInt(roleId) >= 3 && !branchId) {
                    error = 'Branch ID is required for this role.';
                }

                if (!error && loggedInRoleId !== undefined && parseInt(roleId) <= loggedInRoleId) {
                    error = `You cannot assign a role equal or higher than yours.`;
                }

                if (!error && loggedInUser?.companyId && parseInt(companyId) !== loggedInUser.companyId) {
                    error = `You cannot assign another company.`;
                }

                if (!error && loggedInUser?.branchId && parseInt(branchId) !== loggedInUser.branchId) {
                    error = `You cannot assign another branch.`;
                }

                if (!error && loggedInUser?.departmentId && parseInt(departmentId) <= loggedInUser.departmentId) {
                    error = `You cannot assign add user with higher Authority.`;
                }


                if (error) {
                    errorRows.push({
                        Row: index + 2,
                        firstName,
                        lastName,
                        email,
                        contact,
                        birthDate,
                        roleId,
                        companyId,
                        branchId,
                        departmentId,
                        Error: error,
                    });
                } else {
                    validUsers.push({
                        firstName,
                        lastName,
                        email,
                        password,
                        contact,
                        birthDate,
                        roleId,
                        maritalStatus,
                        companyId,
                        branchId: branchId || null,
                        departmentId
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

        if (start && end) {
            data = data.filter(user =>
                moment(user.createdAt).isBetween(start, end, 'day', '[]')
            );
        }
        if (roleFilter > 0) {
            data = data.filter(user =>
                user.roleId === roleFilter
            )
        }

        // if (statusFilter === 'Active') {
        //     data = data.filter(branch => branch.isActive === true);
        // } else if (statusFilter === 'Inactive') {
        //     data = data.filter(branch => branch.isActive === false);
        // }

        if (sortOption === 'Recently Added') {
            data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        } else if (sortOption === 'Ascending') {
            data.sort((a, b) => a.firstName.localeCompare(b.firstName));
        } else if (sortOption === 'Descending') {
            data.sort((a, b) => b.firstName.localeCompare(a.firstName));
        } else if (sortOption === 'Last Month') {
            const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
            const endOfLastMonth = moment().subtract(1, 'month').endOf('month');
            data = data.filter((user) =>
                moment(user.createdAt).isBetween(startOfLastMonth, endOfLastMonth, 'day', '[]')
            );
        } else if (sortOption === 'Last 7 Days') {
            const last7Days = moment().subtract(6, 'days');
            data = data.filter((user) =>
                moment(user.createdAt).isSameOrAfter(last7Days, 'day')
            );
        }

        return data;
    };




    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                        <div className="my-auto mb-2">
                            <h2 className="mb-1">Users</h2>
                            <nav>
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
                            </nav>
                        </div>
                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                            <div className="me-2 mb-2">
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
                                <label className="btn btn-secondary d-flex align-items-center mb-0">
                                    <i className="fa fa-upload me-2" />
                                    Upload Excel
                                    <input
                                        type="file"
                                        accept=".xls,.xlsx"
                                        style={{ display: 'none' }}
                                        onChange={handleExcelUpload}
                                    />
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
                                        Add New User
                                    </Link>
                                }

                            </div>


                            <div className="head-icons ms-2">
                                <CollapseHeader />
                            </div>
                        </div>
                    </div>
                    {/* /Breadcrumb */}
                    {/* Performance Indicator list */}
                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h5>Users List</h5>
                            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                                <div className='mx-3'>
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
                                </div>
                                <div className="dropdown me-3">
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
                                <div className="dropdown">
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
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-3">
                            <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
                                <table className="table datanew table-bordered">
                                    <thead className="table-header">
                                        <tr>
                                            <th className='py-3'>User ID</th>
                                            <th className='py-3'>Name</th>
                                            <th className='py-3'>Contact</th>
                                            <th className='py-3'>Company</th>
                                            <th className='py-3'>Branch</th>
                                            <th className='py-3'>Department</th>
                                            <th className='py-3'>Role</th>
                                            <th className='py-3'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            getSortedFilteredData().map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.firstName + " " + user.lastName}</td>
                                                    <td>{user.contact}</td>
                                                    <td>{getCompanyNameById(user.companyId)}</td>
                                                    <td>{geBranchNameById(user.branchId)}</td>
                                                    <td>{user.departmentId}</td>
                                                    <td>{getRoleNameByRoleId(user.roleId) || "**"}</td>
                                                    <td>
                                                        <div className="action-icon d-inline-flex">
                                                            <Link to="#" onClick={() => setViewUserDetails(user)} className="me-2" data-bs-toggle="modal" data-bs-target="#user_detail">
                                                                <i className="ti ti-eye" />
                                                            </Link>
                                                            <Link
                                                                to="#"
                                                                className="me-2"
                                                                data-bs-toggle="modal"
                                                                data-inert={true}
                                                                onClick={() => setEditUserData(user)}
                                                                data-bs-target="#edit_user"
                                                            >
                                                                <i className="ti ti-edit" />
                                                            </Link>
                                                            <Link to="#" data-bs-toggle="modal" data-inert={true} data-bs-target="#delete_modal">
                                                                <i className="ti ti-trash" />
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
            </div>
            {/* /Page Wrapper */}
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
                        <form onSubmit={(e) => handleAddUserSubmit(e)} >
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">First Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formDactaAddUser.firstName}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, firstName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formDactaAddUser.lastName}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formDactaAddUser.email}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formDactaAddUser.contact}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, contact: e.target.value })}
                                            />
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
                                                    className="pass-input form-control"
                                                    value={formDactaAddUser.password}
                                                    onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, password: e.target.value })}
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
                                                    className="pass-input form-control"
                                                    value={formDactaAddUser.confirmPassword}
                                                    onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, confirmPassword: e.target.value })}
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
                                            <label className="form-label">Birth Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formDactaAddUser.birthDate}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, birthDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Role</label>
                                            <select
                                                className="form-control"
                                                value={formDactaAddUser.roleId}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, roleId: e.target.value })}
                                            >
                                                <option value=''>Select Role</option>
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
                                            <label className="form-label">Marital Status</label>
                                            <select
                                                className="form-control"
                                                value={formDactaAddUser.maritalStatus}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, maritalStatus: e.target.value })}
                                            >
                                                <option value=''>Select Marital Status</option>
                                                <option value="single">Single</option>
                                                <option value="married">Married</option>
                                                <option value="Unmarried">Unmarried</option>


                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Company</label>
                                            <select
                                                className='form-control'
                                                value={formDactaAddUser.companyId}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, companyId: e.target.value })}
                                            >
                                                <option value="null">Select Company</option>
                                                {
                                                    allcompany.map(company => (
                                                        <option key={company.id} value={company.id}>{company.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Branch</label>
                                            <select
                                                disabled={!formDactaAddUser.companyId}
                                                className='form-control'
                                                value={formDactaAddUser.branchId}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, branchId: e.target.value })}
                                            >
                                                <option value="">Not Applicable</option>
                                                {
                                                    filteredBranches.map(branch => (
                                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Department</label>
                                            <select
                                                className='form-control'
                                                value={formDactaAddUser.departmentId}
                                                onChange={(e) => setFormDataAddUser({ ...formDactaAddUser, departmentId: e.target.value })}
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
                                    <div className="col-md-6">
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
                                    </div>
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
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Birth Date</p>
                                                <p className="text-gray-9">
                                                    {formatDate(viewUserDetails?.birthDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Created Date</p>
                                                <p className="text-gray-9">
                                                    {formatDate(viewUserDetails?.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Merital Status</p>
                                                <p className="text-gray-9">
                                                    {viewUserDetails?.maritalStatus}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /user Detail */}
        </>

    )
}

export default Users
