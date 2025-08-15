import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment';
import { all_routes } from '../../router/all_routes'
import PredefinedDateRanges from '../../../core/common/datePicker'
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import ReactApexChart from 'react-apexcharts'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import axiosClient, { baseURL } from '../../../axiosConfig/axiosClient'
import { ADD_NEW_COMPANY, EDIT_COMPANY } from '../../../axiosConfig/apis'
import { toast } from '../../../utils/toastUtil'
import { useAppDispatch, useAppSelector } from '../../../core/data/redux/hooks'
import { CompanyTableItem, mapCompanyDataToTable } from '../../../utils/CompanyTableDataMapper'
import { Company, fetchCompanies } from '../../../core/data/redux/companySlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../../core/data/redux/store'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Password from 'antd/es/input/Password';
import { isValidContact, isValidEmail, isValidInteger, isValidName } from '../../../utils/Validators';

const Companies = () => {
  const dispatch = useAppDispatch();
  const [sortOption, setSortOption] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({
    start: moment().subtract(6, 'days'),
    end: moment(),
  });

  const handleDateRangeChange = (start: moment.Moment, end: moment.Moment) => {
    setDateRange({ start, end });
  };

  const userAllowedLabels = useSelector((state: RootState) => state.feature.allowedFeatures);
  const filteredLabels = userAllowedLabels.map((feature: any) => feature.name);
  const { start, end } = useSelector((state: any) => state.dateRange);
  const companyList = useAppSelector((state) => state.companies.list);
  const [tableData, setTableData] = useState<CompanyTableItem[]>([]);
  const [viewCompanyData, setViewCompanyData] = useState<CompanyTableItem>()
  const [editCompanyData, setEditCompanyData] = useState<Company>()
  const [selectedImageEdit, setSelectedImageEdit] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [headerMessage, setHeaderMessage] = useState<string | null>(null);


  const getSortedFilteredData = () => {
    let data = [...companyList];
    if (start && end) {
      data = data.filter(company =>
        moment(company.createdAt).isBetween(start, end, 'day', '[]')
      );
    }

    if (statusFilter === 'Active') {
      data = data.filter(company => company.isActive === true);
    } else if (statusFilter === 'Inactive') {
      data = data.filter(company => company.isActive === false);
    }

    if (sortOption === 'All') {
      return data;
    } else if (sortOption === 'Recently Added') {
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

  const formatDateForInput = (dateStr: string | undefined): string => {
    return dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";
  };

  const handleSetEditCompany = async (keyId: any) => {
    const companyEdit = companyList.find((company) => company.id === parseInt(keyId));

    if (companyEdit) {
      const formattedCompany = {
        ...companyEdit,
        subscriptionStartDate: formatDateForInput(companyEdit.subscriptionStartDate),
        subscriptionEndDate: formatDateForInput(companyEdit.subscriptionEndDate),
      };

      setEditCompanyData(formattedCompany);
    }
  };


  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setEditCompanyData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'isActive' ? value === 'true' : value
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageEdit(file);
      const imageUrl = URL.createObjectURL(file); // <-- Create preview URL
      setPreviewImage(imageUrl);
    }
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    if (!editCompanyData) return;

    const formData = new FormData();
    formData.append("id", String(editCompanyData.id));
    formData.append("name", editCompanyData.name);
    formData.append("isActive", String(editCompanyData.isActive));
    formData.append("email", editCompanyData.email);
    formData.append("phone", editCompanyData.phone);
    formData.append("website", editCompanyData.website);
    formData.append("address", editCompanyData.address);
    formData.append("subscriptionStartDate", editCompanyData.subscriptionStartDate);
    formData.append("subscriptionEndDate", editCompanyData.subscriptionEndDate);
    formData.append("allowedNoOfUsers", editCompanyData.allowedNoOfUsers.toString());

    if (selectedImageEdit) {
      formData.append("companyImage", selectedImageEdit);
    }
    try {
      const response = await axiosClient.put(`${EDIT_COMPANY}${editCompanyData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        dispatch(fetchCompanies())
        setPreviewImage(null)
        toast('Info', response.data.message, 'success');
      }
    } catch (error: any) {
      toast('Info', error.response.data.message, 'danger');
      console.error(error);
    }



  };




  useEffect(() => {
    setTableData(mapCompanyDataToTable(getSortedFilteredData()))
  }, [companyList, sortOption, start, end, statusFilter])



  const [addCompanyFormData, setAddCompanyFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    companyWebsite: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    allowedNoOfUsers: "",
    firstName: "",
    lastName: "",
    password: "",
  });


  const [formErrors, setFormErrors] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyImage: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    allowedNoOfUsers: "",
    firstName: "",
    lastName: "",
    password: "",
    conformPassword: ""
  });

  const [confirmedPassword, setCOnformedPassword] = useState("")

  const [addCompantImage, setAddCompanyImage] = useState<File | null>(null);

  const handleAddCompanyChange = (e: any) => {
    const { name, value } = e.target;
    setAddCompanyFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCompanyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAddCompanyImage(file);
      setFormErrors(prev => ({ ...prev, companyImage: "" }));

      const imageUrl = URL.createObjectURL(file); // <-- Create preview URL
      setPreviewImage(imageUrl);                 // <-- Save for display
    }
  };



  const handleAddCompanySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      companyName,
      companyEmail,
      companyPhone,
      subscriptionStartDate,
      subscriptionEndDate,
      allowedNoOfUsers,
      firstName,
      lastName,
      password,
    } = addCompanyFormData;

    const newErrors: any = {};

    // ✅ Use your utility functions here:
    if (!companyName.trim()) {
      newErrors.companyName = "Company Name is required";
    } else if (!isValidName(companyName)) {
      newErrors.companyName = "Company Name must contain letters only";
    }

    if (!companyEmail.trim()) {
      newErrors.companyEmail = "Email is required";
    } else if (!isValidEmail(companyEmail)) {
      newErrors.companyEmail = "Enter a valid email address";
    }

    if (!companyPhone.trim()) {
      newErrors.companyPhone = "Phone Number is required";
    } else if (!isValidContact(companyPhone)) {
      newErrors.companyPhone = "Enter a valid 10-digit phone number starting with 6-9";
    }

    if (!subscriptionStartDate.trim()) {
      newErrors.subscriptionStartDate = "Subscription start date is required";
    }
    if (!subscriptionEndDate.trim()) {
      newErrors.subscriptionEndDate = "Subscription end date is required";
    }

    if (!allowedNoOfUsers.trim()) {
      newErrors.allowedNoOfUsers = "Number of users is required";
    } else if (!isValidInteger(allowedNoOfUsers)) {
      newErrors.allowedNoOfUsers = "Number of users must be an integer";
    }

    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required";
    } else if (!isValidName(firstName)) {
      newErrors.firstName = "First Name must contain letters only";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    } else if (!isValidName(lastName)) {
      newErrors.lastName = "Last Name must contain letters only";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!confirmedPassword.trim()) {
      newErrors.conformPassword = "Confirmed Password is required."
    }

    if (password !== confirmedPassword) {
      newErrors.conformPassword = "Password does not match";
    }

    if (!addCompantImage) {
      newErrors.companyImage = "Company image is required";
    }



    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast("Error", "Please fill out all required fields", 'danger');
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !password.trim() || !confirmedPassword.trim()) {
      setHeaderMessage("Please fill out the Admin Info form.");
      toast("Error", "Admin Info is incomplete", "danger");
      return;
    } else {
      setHeaderMessage(null);
    }

    // ✅ Prepare FormData
    const payload = new FormData();
    Object.entries(addCompanyFormData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    if (addCompantImage) {
      payload.append("companyImage", addCompantImage);
    }

    try {
      const response = await axiosClient.post(ADD_NEW_COMPANY, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        dispatch(fetchCompanies());
        setPreviewImage(null)
        toast("Info", response.data.message, "success");
        const closeBtn = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
        closeBtn?.click();
        setAddCompanyFormData({
          companyName: "",
          companyAddress: "",
          companyPhone: "",
          companyEmail: "",
          companyWebsite: "",
          subscriptionStartDate: "",
          subscriptionEndDate: "",
          allowedNoOfUsers: "",
          firstName: "",
          lastName: "",
          password: "",
        });
        setAddCompanyImage(null);

      }
    } catch (error: any) {
      toast(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "danger"
      );
    }
  };


  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Companies</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Application</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Companies List
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
             
              {
                filteredLabels.includes('AddCompany') &&
                <div className="mb-2">
                  <Link
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#add_company"
                    className="btn btn-primary d-flex align-items-center"
                  >
                    <i className="ti ti-circle-plus me-2" />
                    Add Company
                  </Link>
                </div>
              }

              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}
          <div className="row">
            {/* Total Companies */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg bg-primary flex-shrink-0">
                      <i className="ti ti-building fs-16" />
                    </span>
                    <div className="ms-2 overflow-hidden">
                      <p className="fs-12 fw-medium mb-1 text-truncate">
                        Total Companies
                      </p>
                      <h4>{companyList.length}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Total Companies */}
            {/* Total Companies */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg bg-success flex-shrink-0">
                      <i className="ti ti-building fs-16" />
                    </span>
                    <div className="ms-2 overflow-hidden">
                      <p className="fs-12 fw-medium mb-1 text-truncate">
                        Active Companies
                      </p>
                      <h4>{(companyList.filter(comp => comp.isActive === true)).length}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Total Companies */}
            {/* Inactive Companies */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg bg-danger flex-shrink-0">
                      <i className="ti ti-building fs-16" />
                    </span>
                    <div className="ms-2 overflow-hidden">
                      <p className="fs-12 fw-medium mb-1 text-truncate">
                        Inactive Companies
                      </p>
                      <h4>{(companyList.filter(comp => comp.isActive === false)).length}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Inactive Companies */}
            {/* Company Location */}


            {/* <div className="col-lg-3 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg bg-skyblue flex-shrink-0">
                      <i className="ti ti-map-pin-check fs-16" />
                    </span>
                    <div className="ms-2 overflow-hidden">
                      <p className="fs-12 fw-medium mb-1 text-truncate">
                        Company Location
                      </p>
                      <h4>180</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}


            {/* /Company Location */}
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h5>Companies List</h5>
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
                    {['All', 'Recently Added', 'Ascending', 'Descending', 'Last Month', 'Last 7 Days'].map((option) => (
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

              <table className="table datanew table-bordered  bg-white">
                <thead>
                  <tr>
                    <th className="py-3">Company Name</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Website</th>
                    <th className="py-3">Created Date</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((record, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center file-name-icon">
                          <Link to="#" className="avatar avatar-md border rounded-circle">
                            <img
                              src={`${baseURL}/api/image/img/${record.Image}`}
                              className="img-fluid"
                              alt="img"
                            />
                          </Link>
                          <div className="ms-2">
                            <h6 className="fw-medium mb-0">
                              <Link to="#">{record.CompanyName}</Link>
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td>{record.Email}</td>
                      <td>{record.AccountURL}</td>
                      <td>{record.CreatedDate}</td>
                      <td>
                        <span
                          className={`badge ${record.Status === 'Active' ? 'badge-success' : 'badge-danger'} d-inline-flex align-items-center badge-xs`}
                        >
                          <i className="ti ti-point-filled me-1" />
                          {record.Status}
                        </span>
                      </td>
                      <td>
                        <div className="action-icon d-inline-flex">
                          <Link to="#" onClick={() => setViewCompanyData(record)} className="me-2" data-bs-toggle="modal" data-bs-target="#company_detail">
                            <i className="ti ti-eye" />
                          </Link>
                          <Link to="#" onClick={() => handleSetEditCompany(record.key)} className="me-2" data-bs-toggle="modal" data-bs-target="#edit_company">
                            <i className="ti ti-edit" />
                          </Link>
                          {/* <Link to="#" data-bs-toggle="modal" data-bs-target="#delete_modal">
                            <i className="ti ti-trash" />
                          </Link> */}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {tableData.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
      {/* Add Company */}
      <form onSubmit={(e) => handleAddCompanySubmit(e)}>
        <div className="modal fade" id="add_company">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Company</h4>
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

                  <Tabs style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <TabList>
                      <Tab>Company Info</Tab>
                      <Tab>Admin Info</Tab>
                    </TabList>

                    <TabPanel>
                      <div className="row" style={{ minHeight: '300px' }}>
                        <div className="col-md-12">
                          <div className="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4">
                            <div className="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <img
                                src={previewImage || "https://via.placeholder.com/100x100?text=No+Image"}
                                alt="Logo"
                                className="rounded-circle"
                                style={{ width: 100, height: 100, objectFit: "cover" }}
                              />

                            </div>
                            <div className="profile-upload">
                              <div className="mb-2">
                                <h6 className="mb-1">Select Image</h6>
                                <p className="fs-12">Image should be below 4 mb</p>
                              </div>
                              <div className="profile-uploader d-flex align-items-center">
                                <div className={`drag-upload-btn btn btn-sm ${formErrors.companyImage ? 'btn-danger border border-danger' : 'btn-primary'} me-2`}>
                                  Upload
                                  <input
                                    type="file"
                                    name='companyImage'
                                    onChange={handleAddCompanyImageChange}
                                    className="form-control image-sign"
                                  />
                                </div>
                                <button
                                  className="btn btn-light btn-sm"
                                  type='button'
                                  onClick={() => {
                                    setPreviewImage(null);
                                    setAddCompanyImage(null);
                                  }
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                              {formErrors.companyImage && <div className="text-danger mt-1">{formErrors.companyImage}</div>}
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
                              name='companyName'
                              value={addCompanyFormData.companyName}
                              onChange={(e) => handleAddCompanyChange(e)}
                              className={`form-control ${formErrors.companyName ? 'is-invalid' : ''}`} />
                            {formErrors.companyName && <div className="text-danger mt-1">{formErrors.companyName}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email Address<span className="text-danger"> *</span></label>
                            <input
                              type="email"
                              name='companyEmail'
                              value={addCompanyFormData.companyEmail}
                              onChange={(e) => handleAddCompanyChange(e)}
                              className={`form-control ${formErrors.companyEmail ? 'is-invalid' : ''}`} />
                            {formErrors.companyEmail && <div className="text-danger mt-1">{formErrors.companyEmail}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Phone Number <span className="text-danger"> *</span>
                            </label>
                            <input
                              type="text"
                              name='companyPhone'
                              minLength={10}
                              maxLength={10}
                              value={addCompanyFormData.companyPhone}
                              onChange={(e) => handleAddCompanyChange(e)}
                              pattern="[0-9]{10}"
                              title="Enter a 10-digit number"
                              className={`form-control ${formErrors.companyPhone ? 'is-invalid' : ''}`} />
                            {formErrors.companyPhone && <div className="text-danger mt-1">{formErrors.companyPhone}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Website</label>
                            <input
                              type="text"
                              name='companyWebsite'
                              value={addCompanyFormData.companyWebsite}
                              onChange={(e) => handleAddCompanyChange(e)}
                              className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Subscription Start Date <span className="text-danger">*</span></label>
                            <input
                              type="date"
                              name="subscriptionStartDate"
                              value={addCompanyFormData.subscriptionStartDate}
                              onChange={(e) => handleAddCompanyChange(e)}
                              className={`form-control ${formErrors.subscriptionStartDate ? 'is-invalid' : ''}`}
                            />
                            {formErrors.subscriptionStartDate && <div className="text-danger mt-1">{formErrors.subscriptionStartDate}</div>}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Subscription End Date <span className="text-danger">*</span></label>
                            <input
                              type="date"
                              name="subscriptionEndDate"
                              value={addCompanyFormData.subscriptionEndDate}
                              onChange={(e) => handleAddCompanyChange(e)}
                              className={`form-control ${formErrors.subscriptionEndDate ? 'is-invalid' : ''}`}
                            />
                            {formErrors.subscriptionEndDate && <div className="text-danger mt-1">{formErrors.subscriptionEndDate}</div>}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Allowed No. of Users <span className="text-danger">*</span></label>
                            <input
                              type="number"
                              name="allowedNoOfUsers"
                              value={addCompanyFormData.allowedNoOfUsers}
                              onChange={(e) => handleAddCompanyChange(e)}
                              className={`form-control ${formErrors.allowedNoOfUsers ? 'is-invalid' : ''}`}
                              min={1}
                            />
                            {formErrors.allowedNoOfUsers && <div className="text-danger mt-1">{formErrors.allowedNoOfUsers}</div>}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              name='companyAddress'
                              value={addCompanyFormData.companyAddress}
                              onChange={(e) => handleAddCompanyChange(e)}
                              className="form-control" />
                          </div>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel>
                      <div className="row" style={{ minHeight: '200px' }}>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">First Name <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              name="firstName"
                              value={addCompanyFormData.firstName}
                              onChange={handleAddCompanyChange}
                              className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                            />
                            {formErrors.firstName && <div className="text-danger mt-1">{formErrors.firstName}</div>}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Last Name <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              name="lastName"
                              value={addCompanyFormData.lastName}
                              onChange={handleAddCompanyChange}
                              className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                            />
                            {formErrors.lastName && <div className="text-danger mt-1">{formErrors.lastName}</div>}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3 position-relative">
                            <label className="form-label">
                              Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={addCompanyFormData.password}
                                onChange={handleAddCompanyChange}
                                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                              />
                              <span
                                className="input-group-text"
                                onClick={() => setShowPassword(prev => !prev)}
                                style={{ cursor: "pointer" }}
                              >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                              </span>
                            </div>
                            {formErrors.password && (
                              <div className="text-danger mt-1">{formErrors.password}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3 position-relative">
                            <label className="form-label">
                              Confirm Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmedPassword}
                                onChange={(e) => setCOnformedPassword(e.target.value)}
                                className={`form-control ${formErrors.conformPassword ? 'is-invalid' : ''}`}
                              />
                              <span
                                className="input-group-text"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                style={{ cursor: "pointer" }}
                              >
                                <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                              </span>
                            </div>
                            {formErrors.conformPassword && (
                              <div className="text-danger mt-1">{formErrors.conformPassword}</div>
                            )}
                          </div>
                        </div>


                      </div>
                    </TabPanel>
                  </Tabs>


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
                  Add Company
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* /Add Company */}





      {/* Edit Company */}
      <div className="modal fade" id="edit_company">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Company</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={(e) => handleEditSubmit(e)}>
              <div className="modal-body pb-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4">
                      <div className="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames">
                        <img
                          src={previewImage || `${baseURL}/api/image/img/${editCompanyData?.companyImage}`}
                          className="img-fluid"
                          alt="img"
                        />
                      </div>
                      <div className="profile-upload">
                        <div className="mb-2">
                          <h6 className="mb-1">Upload Profile Image</h6>
                          <p className="fs-12">Image should be below 4 mb</p>
                        </div>
                        <div className="profile-uploader d-flex align-items-center">
                          <div className="drag-upload-btn btn btn-sm btn-primary me-2">
                            Upload
                            <input
                              type="file"
                              name='companyImage'
                              onChange={handleImageChange}
                              className="form-control image-sign"
                              multiple
                            />
                          </div>
                          <button
                                  className="btn btn-light btn-sm"
                                  type='button'
                                  onClick={() => {
                                    setPreviewImage(null);
                                    setSelectedImageEdit(null);
                                  }
                                  }
                                >
                                  Cancel
                                </button>
                        </div>
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
                        value={editCompanyData?.name}
                        onChange={handleEditInputChange}
                        className="form-control"
                        defaultValue="Stellar Dynamics"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        onChange={handleEditInputChange}
                        name='isActive'
                        className="form-select"
                        value={editCompanyData?.isActive ? 'true' : 'false'}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name='email'
                        onChange={handleEditInputChange}
                        value={editCompanyData?.email}
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
                        name='phone'
                        maxLength={10}
                        minLength={10}
                        onChange={handleEditInputChange}
                        value={editCompanyData?.phone}
                        className="form-control"
                        defaultValue="+1 895455450"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Subscription Start Date <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="date"
                        name='subscriptionStartDate'
                        onChange={handleEditInputChange}
                        value={editCompanyData?.subscriptionStartDate}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Subscription End Date <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="date"
                        name='subscriptionEndDate'
                        onChange={handleEditInputChange}
                        value={editCompanyData?.subscriptionEndDate}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Allowed Number of Users <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        name='allowedNoOfUsers'
                        onChange={handleEditInputChange}
                        value={editCompanyData?.allowedNoOfUsers}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Website</label>
                      <input
                        type="text"
                        name='website'
                        onChange={handleEditInputChange}
                        value={editCompanyData?.website}
                        className="form-control"
                        defaultValue="Admin Website"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name='address'
                        onChange={handleEditInputChange}
                        value={editCompanyData?.address}
                        className="form-control" />
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
      {/* /Edit Company */}
      {/* Company Detail */}
      <div className="modal fade" id="company_detail">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Company Detail</h4>
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
                      <img
                        src={`${baseURL}/api/image/img/${viewCompanyData?.Image}`}
                        className="img-fluid"
                        alt="img"
                      />
                    </Link>
                    <div>
                      <p className="text-gray-9 fw-medium mb-0">
                        {viewCompanyData?.CompanyName}
                      </p>
                      <p>{viewCompanyData?.Email}</p>
                    </div>
                  </div>
                  <span className={`badge ${viewCompanyData?.Status === 'Active' ? "badge-success" : "badge-danger"} `}>
                    <i className="ti ti-point-filled" />
                    {viewCompanyData?.Status === "Active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-gray-9 fw-medium">Basic Info</p>
                <div className="pb-1 border-bottom mb-4">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Website</p>
                        <p className="text-gray-9">{viewCompanyData?.AccountURL}</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Phone Number</p>
                        <p className="text-gray-9">{viewCompanyData?.Phone}</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Allowed Users</p>
                        <p className="text-gray-9">{viewCompanyData?.allowedNoOfUsers}</p>
                      </div>
                    </div>

                  </div>
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Created Date</p>
                        <p className="text-gray-9">
                          {viewCompanyData?.CreatedDate}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Subscription Start Date</p>
                        <p className="text-gray-9">
                          {viewCompanyData?.subscriptionStartDate}
                        </p>
                      </div>
                    </div><div className="col-md-4">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Subscription End Date</p>
                        <p className="text-gray-9">
                          {viewCompanyData?.subscriptionEndDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Addresss</p>
                        <p className="text-gray-9">
                          {viewCompanyData?.Address}
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
      {/* /Company Detail */}
    </>


  )
}

export default Companies