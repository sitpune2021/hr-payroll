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

const Companies = () => {
  const dispatch = useAppDispatch();
  
  const [sortOption, setSortOption] = useState('Last 7 Days');
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

  const handleSetEditCompany = async (keyId: any) => {
    const companyEdit = companyList.find((company) => company.id === parseInt(keyId));
    setEditCompanyData(companyEdit);

  }

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
        toast('Info', response.data.message, 'success');
      }
    } catch (error: any) {
      toast('Info', error.response.data.message, 'danger');
      console.error(error);
    }



  };




  useEffect(() => {
    setTableData(mapCompanyDataToTable(getSortedFilteredData()))
  }, [companyList,sortOption,start,end,statusFilter])



  const [addCompanyFormData, setAddCompanyFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyAddress: "",
  });

  const [formErrors, setFormErrors] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyImage: ""
  });

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
    }
  };


  const handleAddCompanySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { companyName, companyEmail, companyPhone } = addCompanyFormData;
    const newErrors: any = {};

    if (!companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!companyEmail.trim()) {
      newErrors.companyEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
      newErrors.companyEmail = "Enter a valid email address";
    }

    if (!companyPhone.trim()) {
      newErrors.companyPhone = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(companyPhone)) {
      newErrors.companyPhone = "Enter a valid 10-digit phone number";
    }

    if (!addCompantImage) {
      newErrors.companyImage = "Company image is required";
    }

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // prepare FormData
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
        toast('Info', response.data.message, 'success');
        setAddCompanyFormData({
          companyName: "",
          companyEmail: "",
          companyPhone: "",
          companyWebsite: "",
          companyAddress: "",
        })
        setAddCompanyImage(null)
      }

    } catch (error: any) {
      toast('Error', error.response?.data?.message || 'Something went wrong', 'danger');
    }
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
                  <ReactApexChart
                    options={totalChart}
                    series={totalChart.series}
                    type="area"
                    width={50}
                  />
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
                      <h4>920</h4>
                    </div>
                  </div>
                  <ReactApexChart
                    options={activeChart}
                    series={activeChart.series}
                    type="area"
                    width={50}
                  />
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
                      <h4>30</h4>
                    </div>
                  </div>
                  <ReactApexChart
                    options={inactiveChart}
                    series={inactiveChart.series}
                    type="area"
                    width={50}
                  />
                </div>
              </div>
            </div>
            {/* /Inactive Companies */}
            {/* Company Location */}
            <div className="col-lg-3 col-md-6 d-flex">
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
                  <ReactApexChart
                    options={locationChart}
                    series={locationChart.series}
                    type="area"
                    width={50}
                  />
                </div>
              </div>
            </div>
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
                        onClick={()=>setStatusFilter('All')}
                      >
                        All
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                        onClick={()=>setStatusFilter('Active')}
                      >
                        Active
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                        onClick={()=>setStatusFilter('Inactive')}
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
                          <Link to="#" data-bs-toggle="modal" data-bs-target="#delete_modal">
                            <i className="ti ti-trash" />
                          </Link>
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
                          <div className={`drag-upload-btn btn btn-sm ${formErrors.companyImage ? 'btn-danger border border-danger' : 'btn-primary'} me-2`}>
                            Upload
                            <input
                              type="file"
                              name='companyImage'
                              onChange={handleAddCompanyImageChange}
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
                  <div className="col-md-12">
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
                          src={`${baseURL}/api/image/img/${editCompanyData?.companyImage}`}
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
                    <div className="col-md-6">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Website</p>
                        <p className="text-gray-9">www.exmple.com</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Phone Number</p>
                        <p className="text-gray-9">{viewCompanyData?.Phone}</p>
                      </div>
                    </div>

                  </div>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Addresss</p>
                        <p className="text-gray-9">
                          {viewCompanyData?.Address}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <p className="fs-12 mb-0">Created Date</p>
                        <p className="text-gray-9">
                          {viewCompanyData?.CreatedDate}
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