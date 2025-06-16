import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker } from 'antd'
import { useAppDispatch, useAppSelector } from '../../core/data/redux/hooks'
import axiosClient from '../../axiosConfig/axiosClient'
import { ADD_NEW_BRANCH, EDIT_BRANCH } from '../../axiosConfig/apis'
import { toast } from '../../utils/toastUtil'
import ImageWithBasePath from '../../core/common/imageWithBasePath'
import { all_routes } from '../router/all_routes'
import CollapseHeader from '../../core/common/collapse-header/collapse-header'
import PredefinedDateRanges from '../../core/common/datePicker'
import CommonSelect from '../../core/common/commonSelect'
import { Company } from '../../core/data/redux/companySlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../core/data/redux/store'
import { Branch, fetchBranches } from '../../core/data/redux/branchesSlice';
import { formatDate } from '../../utils/dateformatter1';
import moment from 'moment'
import { Template } from '../../core/data/redux/payrolltemplateSlice'
type PasswordField = "password" | "confirmPassword";

const Branches = () => {


    // const data = companies_details;
    const dispatch = useAppDispatch();
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOption, setSortOption] = useState('Last 7 Days');

    const [allcompany, setAllCompany] = useState<Company[]>([])
    const [allBranches, setAllBranches] = useState<Branch[]>([])
    const [allPayrollTemp, setAllPayrollTemp] = useState<Template[]>([])
    const [viewBranchData, setViewBranchData] = useState<Branch>()
    const [editBranchData, setEditBranchData] = useState<Branch>()

    const [addBranchLogo, setAddBranchLogo] = useState<File | null>(null);
    const [addBranchBankDetails, setAddBranchBankDetails] = useState<File | null>(null);


    const user = useSelector((state: RootState) => state.auth.user);
    const { start, end } = useSelector((state: any) => state.dateRange);

    const companyList = useAppSelector((state) => state.companies.list);
    const branchList: Branch[] = useSelector((state: RootState) => state.branches.branches);
    const payrollTempList: Template[] = useSelector((state: RootState) => state.payrollTemplate.templates);

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setEditBranchData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: name === 'isActive' ? value === 'true' : value
            };
        });
    };

    const getSortedFilteredData = () => {
        let data = [...branchList];

        if (start && end) {
            data = data.filter(branch =>
                moment(branch.createdAt).isBetween(start, end, 'day', '[]')
            );
        }

        // if (statusFilter === 'Active') {
        //     data = data.filter(branch => branch.isActive === true);
        // } else if (statusFilter === 'Inactive') {
        //     data = data.filter(branch => branch.isActive === false);
        // }

        if (sortOption === 'Recently Added') {
            data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
        } else if (sortOption === 'Ascending') {
            data.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'Descending') {
            data.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === 'Last Month') {
            const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
            const endOfLastMonth = moment().subtract(1, 'month').endOf('month');
            data = data.filter((company) =>
                moment(company.createdAt).isBetween(startOfLastMonth, endOfLastMonth, 'day', '[]')
            );
        } else if (sortOption === 'Last 7 Days') {
            const last7Days = moment().subtract(6, 'days');
            data = data.filter((company) =>
                moment(company.createdAt).isSameOrAfter(last7Days, 'day')
            );
        }

        return data;
    };

    const handleSortChange = (option: string) => {
        setSortOption(option);
    };

    const handleEditBranchSubmit = async (e: any) => {
        e.preventDefault();
        const branchData = editBranchData;
        try {
            const response = await axiosClient.put(`${EDIT_BRANCH}${editBranchData?.id}`, branchData);
            if (response.status === 200) {
                toast('Info', response.data.message, 'success');
                dispatch(fetchBranches());
            }
        } catch (error: any) {
            console.log(error);

            toast('Error', error.response.data.message, 'danger');
        }


    }

    useEffect(() => {
        if (companyList.length > 0) {
            const activeCompany = companyList.filter(company => company.isActive);
            const loggedUsersCompany = companyList.find(
                (company) => company.id === user?.companyId
            );

            if (loggedUsersCompany) {
                setAllCompany([loggedUsersCompany]);
                setAllPayrollTemp(
                    payrollTempList.filter(temp => temp.companyId === loggedUsersCompany.id)
                )
            } else {
                setAllCompany(activeCompany);
                setAllPayrollTemp(payrollTempList)
            }
        }

        if (branchList.length > 0) {
            const loggedUsersBranches = branchList.filter(
                (branch) => branch.companyId === user?.companyId
            );

            if (loggedUsersBranches.length > 0) {
                setAllBranches(loggedUsersBranches);
            } else {
                setAllBranches(getSortedFilteredData());
            }
        }

    }, [branchList, companyList, payrollTempList, user?.companyId, sortOption, statusFilter, start, end]);

    const getCompanyNameById = (companyId: number | undefined): string => {
        const company = companyList.find((comp) => comp.id === companyId);
        return company ? company.name : 'Unknown Company';
    };

    const [addBranchFormData, setAddBranchFormData] = useState({
        name: "",
        email: "",
        phone: "",
        companyId: "",
        address: "",
        nameOfSalarySlip: ""
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        phone: "",
        companyId: "",
        templateId: "",
        branchLogo: "",
        nameOfSalarySlip: "",
        bankDetails: ""
    });

    const handleAddBranchLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAddBranchLogo(file);
            setFormErrors(prev => ({ ...prev, branchLogo: "" }));
        }
    };

    const handleAddBranchBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAddBranchBankDetails(file);
            setFormErrors(prev => ({ ...prev, bankDetails: "" }));
        }
    };


    const handleAddBranchChange = (e: any) => {
        const { name, value } = e.target;
        setAddBranchFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleAddBranchSUbmit = async (e: any) => {
        e.preventDefault();
        const { name, email, phone, companyId, address, nameOfSalarySlip } = addBranchFormData;
        const newErrors: any = {}
        if (!name.trim()) newErrors.name = "Branch Name is required";
        if (!email.trim()) {
            newErrors.email = "Branch email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!phone.trim()) {
            newErrors.phone = "Branch phone is required";
        } else if (!/^[0-9]{10}$/.test(phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }
        if (!companyId.trim()) newErrors.companyId = "Company selection is required";
        if (!addBranchLogo) newErrors.branchLogo = "Branch logo is required";
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("companyId", companyId);
            formData.append("address", address);
            formData.append("nameOfSalarySlip", nameOfSalarySlip);
            if (addBranchLogo) {
                formData.append("branchLogo", addBranchLogo);
            }

            if (addBranchBankDetails) {
                formData.append("bankDetails", addBranchBankDetails);
            }

            const response = await axiosClient.post(ADD_NEW_BRANCH, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 201) {
                dispatch(fetchBranches());
                toast('Info', response.data.message, 'success');
            }
            console.log(formData);
            
        } catch (error: any) {
            toast('Info', error.response?.data?.message || "Something went wrong", 'danger');
        }

        console.log(addBranchFormData, "@@@@@@@@@");

    }


    const getModalContainer = () => {
        const modalElement = document.getElementById('modal-datepicker');
        return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
    };

    const [totalChart] = React.useState<any>({
        series: [{
            name: "Messages",
            data: [25, 66, 41, 12, 36, 9, 21]
        }],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0, // Start with 0 opacity (transparent)
                opacityTo: 0    // End with 0 opacity (transparent)
            }
        },
        chart: {
            foreColor: '#fff',
            type: "area",
            width: 50,
            toolbar: {
                show: !1
            },
            zoom: {
                enabled: !1
            },
            dropShadow: {
                enabled: 0,
                top: 3,
                left: 14,
                blur: 4,
                opacity: .12,
                color: "#fff"
            },
            sparkline: {
                enabled: !0
            }
        },
        markers: {
            size: 0,
            colors: ["#F26522"],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 7
            }
        },
        plotOptions: {
            bar: {
                horizontal: !1,
                columnWidth: "35%",
                endingShape: "rounded"
            }
        },
        dataLabels: {
            enabled: !1
        },
        stroke: {
            show: !0,
            width: 2.5,
            curve: "smooth"
        },
        colors: ["#F26522"],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: !1
            },
            x: {
                show: !1
            },
            y: {
                title: {
                    formatter: function (e: any) {
                        return ""
                    }
                }
            },
            marker: {
                show: !1
            }
        }
    })
    const [activeChart] = React.useState<any>({
        series: [{
            name: "Active Company",
            data: [25, 40, 35, 20, 36, 9, 21]
        }],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0, // Start with 0 opacity (transparent)
                opacityTo: 0    // End with 0 opacity (transparent)
            }
        },
        chart: {
            foreColor: '#fff',
            type: "area",
            width: 50,
            toolbar: {
                show: !1
            },
            zoom: {
                enabled: !1
            },
            dropShadow: {
                enabled: 0,
                top: 3,
                left: 14,
                blur: 4,
                opacity: .12,
                color: "#fff"
            },
            sparkline: {
                enabled: !0
            }
        },
        markers: {
            size: 0,
            colors: ["#F26522"],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 7
            }
        },
        plotOptions: {
            bar: {
                horizontal: !1,
                columnWidth: "35%",
                endingShape: "rounded"
            }
        },
        dataLabels: {
            enabled: !1
        },
        stroke: {
            show: !0,
            width: 2.5,
            curve: "smooth"
        },
        colors: ["#F26522"],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: !1
            },
            x: {
                show: !1
            },
            y: {
                title: {
                    formatter: function (e: any) {
                        return ""
                    }
                }
            },
            marker: {
                show: !1
            }
        }
    })
    const [inactiveChart] = React.useState<any>({
        series: [{
            name: "Inactive Company",
            data: [25, 10, 35, 5, 25, 28, 21]
        }],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0, // Start with 0 opacity (transparent)
                opacityTo: 0    // End with 0 opacity (transparent)
            }
        },
        chart: {
            foreColor: '#fff',
            type: "area",
            width: 50,
            toolbar: {
                show: !1
            },
            zoom: {
                enabled: !1
            },
            dropShadow: {
                enabled: 0,
                top: 3,
                left: 14,
                blur: 4,
                opacity: .12,
                color: "#fff"
            },
            sparkline: {
                enabled: !0
            }
        },
        markers: {
            size: 0,
            colors: ["#F26522"],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 7
            }
        },
        plotOptions: {
            bar: {
                horizontal: !1,
                columnWidth: "35%",
                endingShape: "rounded"
            }
        },
        dataLabels: {
            enabled: !1
        },
        stroke: {
            show: !0,
            width: 2.5,
            curve: "smooth"
        },
        colors: ["#F26522"],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: !1
            },
            x: {
                show: !1
            },
            y: {
                title: {
                    formatter: function (e: any) {
                        return ""
                    }
                }
            },
            marker: {
                show: !1
            }
        }
    })
    const [locationChart] = React.useState<any>({
        series: [{
            name: "Inactive Company",
            data: [30, 40, 15, 23, 20, 23, 25]
        }],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0, // Start with 0 opacity (transparent)
                opacityTo: 0    // End with 0 opacity (transparent)
            }
        },
        chart: {
            foreColor: '#fff',
            type: "area",
            width: 50,
            toolbar: {
                show: !1
            },
            zoom: {
                enabled: !1
            },
            dropShadow: {
                enabled: 0,
                top: 3,
                left: 14,
                blur: 4,
                opacity: .12,
                color: "#fff"
            },
            sparkline: {
                enabled: !0
            }
        },
        markers: {
            size: 0,
            colors: ["#F26522"],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 7
            }
        },
        plotOptions: {
            bar: {
                horizontal: !1,
                columnWidth: "35%",
                endingShape: "rounded"
            }
        },
        dataLabels: {
            enabled: !1
        },
        stroke: {
            show: !0,
            width: 2.5,
            curve: "smooth"
        },
        colors: ["#F26522"],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: !1
            },
            x: {
                show: !1
            },
            y: {
                title: {
                    formatter: function (e: any) {
                        return ""
                    }
                }
            },
            marker: {
                show: !1
            }
        }
    })

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                        <div className="my-auto mb-2">
                            <h2 className="mb-1">Branches</h2>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">Application</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Branch List
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
                            <div className="mb-2">
                                <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add_company"
                                    className="btn btn-primary d-flex align-items-center"
                                >
                                    <i className="ti ti-circle-plus me-2" />
                                    Add Branch
                                </Link>
                            </div>
                            <div className="ms-2 head-icons">
                                <CollapseHeader />
                            </div>
                        </div>
                    </div>
                    {/* /Breadcrumb */}

                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h5>Branches List</h5>
                            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
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
                                        Select Plan
                                    </Link>
                                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                Advanced
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                Basic
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                Enterprise
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="dropdown me-3">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                    >
                                        Select Status
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
                        <div className="card-body p-2">
                            <div className="table-responsive p-2">
                                <table className="table datanew table-bordered">
                                    <thead>
                                        <tr>
                                            <th className='py-3'>Branch Name</th>
                                            <th>Address</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Created Date</th>
                                            <th>Company</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allBranches.map((branch, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center file-name-icon">
                                                        <div className="ms-2">
                                                            <h6 className="fw-medium mb-0">
                                                                <Link to="#">{branch.name}</Link>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{branch.address}</td>
                                                <td>{branch.email}</td>
                                                <td>{branch.phone}</td>
                                                <td>{formatDate(branch.createdAt)}</td>
                                                <td>{getCompanyNameById(branch.companyId)}</td>
                                                <td>
                                                    <div className="action-icon d-inline-flex">
                                                        <Link to="#" onClick={() => setViewBranchData(branch)} className="me-2" data-bs-toggle="modal" data-bs-target="#company_detail">
                                                            <i className="ti ti-eye" />
                                                        </Link>
                                                        <Link to="#" onClick={() => setEditBranchData(branch)} className="me-2" data-bs-toggle="modal" data-bs-target="#edit_company">
                                                            <i className="ti ti-edit" />
                                                        </Link>
                                                        <Link to="#" data-bs-toggle="modal" data-bs-target="#delete_modal">
                                                            <i className="ti ti-trash" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {allBranches.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="text-center">No data found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
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
            {/* Add Branch */}
            <form onSubmit={(e) => handleAddBranchSUbmit(e)}>
                <div className="modal fade" id="add_company">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add New Branch</h4>
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
                                <div className="row">
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
                                                    <div className={`drag-upload-btn btn btn-sm ${formErrors.branchLogo ? 'btn-danger border border-danger' : 'btn-primary'} me-2`}>
                                                        Upload
                                                        <input
                                                            type="file"
                                                            name='branchLogo'
                                                            onChange={handleAddBranchLogoChange}
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
                                                {formErrors.branchLogo && <div className="text-danger mt-1">{formErrors.branchLogo}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Name <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name='name'
                                                value={addBranchFormData.name}
                                                onChange={(e) => handleAddBranchChange(e)}
                                                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} />
                                            {formErrors.name && <div className="text-danger mt-1">{formErrors.name}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Name of Salary Slip <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name='nameOfSalarySlip'
                                                value={addBranchFormData.nameOfSalarySlip}
                                                onChange={(e) => handleAddBranchChange(e)}
                                                className={`form-control ${formErrors.nameOfSalarySlip ? 'is-invalid' : ''}`} />
                                            {formErrors.nameOfSalarySlip && <div className="text-danger mt-1">{formErrors.nameOfSalarySlip}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Select Company <span className="text-danger"> *</span>
                                            </label>
                                            <select
                                                name='companyId'
                                                value={addBranchFormData.companyId}
                                                className={`form-control ${formErrors.companyId ? 'is-invalid' : ''}`}
                                                onChange={(e) => handleAddBranchChange(e)}
                                            >
                                                <option value="">--Select Company--</option>
                                                {
                                                    allcompany.map(company => (
                                                        <option key={company.id} value={company.id}>{company.name}</option>
                                                    ))
                                                }
                                            </select>
                                            {formErrors.companyId && <div className="text-danger mt-1">{formErrors.companyId}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Address</label>
                                            <input
                                                type="text"
                                                name='address'
                                                value={addBranchFormData.address}
                                                onChange={(e) => handleAddBranchChange(e)}
                                                className="form-control" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Phone Number <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name='phone'
                                                value={addBranchFormData.phone}
                                                onChange={(e) => handleAddBranchChange(e)}
                                                className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`} />
                                            {formErrors.phone && <div className="text-danger mt-1">{formErrors.phone}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Email Address</label>
                                            <input
                                                type="email"
                                                name='email'
                                                value={addBranchFormData.email}
                                                onChange={(e) => handleAddBranchChange(e)}
                                                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} />
                                            {formErrors.email && <div className="text-danger mt-1">{formErrors.email}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Bank Details <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="file"
                                                name='bankDetails'
                                                onChange={(e) => handleAddBranchBankDetailsChange(e)}
                                                className={`form-control ${formErrors.bankDetails ? 'is-invalid' : ''}`} />
                                            {formErrors.bankDetails && <div className="text-danger mt-1">{formErrors.bankDetails}</div>}
                                        </div>
                                    </div>



                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-light me-2"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add Branch
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
            {/* /Add Branch */}
            {/* Edit Branch */}
            <div className="modal fade" id="edit_company">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Branch of Company {getCompanyNameById(editBranchData?.companyId)}</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={(e) => handleEditBranchSubmit(e)}>
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Name <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name='name'
                                                onChange={handleEditInputChange}
                                                value={editBranchData?.name}
                                                className="form-control"
                                                defaultValue="Stellar Dynamics"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Email Address</label>
                                            <input
                                                type="email"
                                                onChange={handleEditInputChange}
                                                name='email'
                                                value={editBranchData?.email}
                                                className="form-control"
                                                defaultValue="sophie@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Phone Number <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                onChange={handleEditInputChange}
                                                name='phone'
                                                value={editBranchData?.phone}
                                                className="form-control"
                                                defaultValue="+1 895455450"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Address</label>
                                            <input
                                                type="text"
                                                onChange={handleEditInputChange}
                                                name='address'
                                                value={editBranchData?.address}
                                                className="form-control"
                                                defaultValue="Admin Website"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-light me-2"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button type="submit" data-bs-dismiss="modal" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Edit Branch */}
            {/* branch Detail */}
            <div className="modal fade" id="company_detail">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Branch Detail</h4>
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
                                        <Link
                                            to="#"
                                            className="avatar avatar-md border rounded-circle flex-shrink-0 me-2"
                                        >
                                            <ImageWithBasePath
                                                src="assets/img/company/company-01.svg"
                                                className="img-fluid"
                                                alt="img"
                                            />
                                        </Link>
                                        <div>
                                            <p className="text-gray-9 fw-medium mb-0">
                                                {viewBranchData?.name}
                                            </p>
                                            <p>{viewBranchData?.email}</p>
                                        </div>
                                    </div>
                                    <span className="badge badge-success">
                                        <i className="ti ti-point-filled" />
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-gray-9 fw-medium">Basic Info</p>
                                <div className="pb-1 border-bottom mb-4">
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Phone Number</p>
                                                <p className="text-gray-9">{viewBranchData?.phone}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Created Date</p>
                                                <p className="text-gray-9">{formatDate(viewBranchData?.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Address</p>
                                                <p className="text-gray-9">{viewBranchData?.address}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Company Name</p>
                                                <p className="text-gray-9">
                                                    {getCompanyNameById(viewBranchData?.companyId)}
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
            {/* /branch Detail */}
        </>


    )
}

export default Branches