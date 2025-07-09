import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Chart } from "primereact/chart";
import { Calendar } from 'primereact/calendar';
import ProjectModals from "../../../core/modals/projectModal";
import RequestModals from "../../../core/modals/requestModal";
import TodoModal from "../../../core/modals/todoModal";
import CollapseHeader from "../../../core/common/collapse-header/collapse-header";
import CommonSelect from "../../../core/common/commonSelect";

import { useSelector } from "react-redux";
import { RootState } from "../../../core/data/redux/store";
import axiosClient from "../../../axiosConfig/axiosClient";
import { FETCH_COMPANYS_LEAVE_RECORDS } from "../../../axiosConfig/apis";
import { formatDate } from "../../../utils/dateformatter1";

const AdminDashboard = () => {
  const routes = all_routes;
  interface LeaveRecord {
    id: number;
    userId: number;
    leaveType: string;
    fromDate: string;
    toDate: string;
    totalDays: number;
    reason: string;
    status: string;
    approverId: number | null;
    remarks: string | null;
    createdAt: string;
    updatedAt: string;
    employee: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
    approver: {
      id: number;
      firstName: string;
      lastName: string;
    } | null;
  }

  const user = useSelector((state: RootState) => state.auth.user);


  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const formattedMonthAgo = oneMonthAgo.toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(formattedMonthAgo);
  const [toDate, setToDate] = useState(formattedToday);
  const [selectedLeaveRecord, setSelectedLeaveRecord] = useState<LeaveRecord | null>(null);



  const [isTodo, setIsTodo] = useState([false, false, false]);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  useEffect(() => {
    const fetchLeaveRecords = async (companyId: number) => {
      try {
        const res = await axiosClient.get(FETCH_COMPANYS_LEAVE_RECORDS, {
          params: {
            companyId,
            fromDate,
            toDate,
          },
        });
        if (res.status === 200) setLeaveRecords(res.data);

      } catch (err) {
        console.error('Error fetching leave records:', err);
      }
    };

    if (user && user.companyId) {
      fetchLeaveRecords(user.companyId);
    }
  }, [user, toDate, fromDate]);

  const handleLeaveAction = async (status: any) => {
    if (!selectedLeaveRecord) return;

    try {
      await axiosClient.post(`/api/leave-records/${selectedLeaveRecord.id}/status`, {
        status,
        remarks: prompt(`Add remarks for ${status.toLowerCase()}:`) || null,
      });

      alert(`Leave ${status.toLowerCase()} successfully!`);
      // Refresh list or modal here
      setSelectedLeaveRecord(null); // Close modal if needed
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };



  //New Chart
  const [empDepartment] = useState<any>({
    chart: {
      height: 235,
      type: 'bar',
      padding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      toolbar: {
        show: false,
      }
    },
    fill: {
      colors: ['#F26522'], // Fill color for the bars
      opacity: 1, // Adjust opacity (1 is fully opaque)
    },
    colors: ['#F26522'],
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5,
      padding: {
        top: -20,
        left: 0,
        right: 0,
        bottom: 0
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: true,
        barHeight: '35%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    series: [{
      data: [80, 110, 80, 20, 60, 100],
      name: 'Employee'
    }],
    xaxis: {
      categories: ['UI/UX', 'Development', 'Management', 'HR', 'Testing', 'Marketing'],
      labels: {
        style: {
          colors: '#111827',
          fontSize: '13px',
        }
      }
    }
  })

  const [salesIncome] = useState<any>({
    chart: {
      height: 290,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      }
    },
    colors: ['#FF6F28', '#F8F9FA'],
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusWhenStacked: 'all',
        horizontal: false,
        endingShape: 'rounded'
      },
    },
    series: [{
      name: 'Income',
      data: [40, 30, 45, 80, 85, 90, 80, 80, 80, 85, 20, 80]
    }, {
      name: 'Expenses',
      data: [60, 70, 55, 20, 15, 10, 20, 20, 20, 15, 80, 20]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '13px',
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: '#6B7280',
          fontSize: '13px',
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5,
      padding: {
        left: -8,
      },
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false // Disable data labels
    },
    fill: {
      opacity: 1
    },
  })

  //Attendance ChartJs
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  useEffect(() => {
    const data = {
      labels: ['Late', 'Present', 'Permission', 'Absent'],
      datasets: [

        {
          label: 'Semi Donut',
          data: [40, 20, 30, 10],
          backgroundColor: ['#0C4B5E', '#03C95A', '#FFC107', '#E70D0D'],
          borderWidth: 5,
          borderRadius: 10,
          borderColor: '#fff', // Border between segments
          hoverBorderWidth: 0,   // Border radius for curved edges
          cutout: '60%',
        }
      ]
    };
    const options = {
      rotation: -100,
      circumference: 200,
      layout: {
        padding: {
          top: -20,    // Set to 0 to remove top padding
          bottom: -20, // Set to 0 to remove bottom padding
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Hide the legend
        }
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  //Semi Donut ChartJs
  const [semidonutData, setSemidonutData] = useState({});
  const [semidonutOptions, setSemidonutOptions] = useState({});
  const toggleTodo = (index: number) => {
    setIsTodo((prevIsTodo) => {
      const newIsTodo = [...prevIsTodo];
      newIsTodo[index] = !newIsTodo[index];
      return newIsTodo;
    });
  };
  useEffect(() => {

    const data = {
      labels: ["Ongoing", "Onhold", "Completed", "Overdue"],
      datasets: [
        {
          label: 'Semi Donut',
          data: [20, 40, 20, 10],
          backgroundColor: ['#FFC107', '#1B84FF', '#03C95A', '#E70D0D'],
          borderWidth: -10,
          borderColor: 'transparent', // Border between segments
          hoverBorderWidth: 0,   // Border radius for curved edges
          cutout: '75%',
          spacing: -30,
        },
      ],
    };

    const options = {
      rotation: -100,
      circumference: 185,
      layout: {
        padding: {
          top: -20,    // Set to 0 to remove top padding
          bottom: 20, // Set to 0 to remove bottom padding
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Hide the legend
        }
      }, elements: {
        arc: {
          borderWidth: -30, // Ensure consistent overlap
          borderRadius: 30, // Add some rounding
        }
      },
    };

    setSemidonutData(data);
    setSemidonutOptions(options);
  }, []);

  const todoItemList = [
    {
      label: "Today Birthday & Work Anniversary",
      icon: "ti-cake",
      color: "#e83e8c", // pinkish
      value: 0,
    },
    {
      label: "Announcement",
      icon: "ti-speakerphone",
      color: "#090a09",
      value: 5,
    },
    {
      label: "Pending Leave Request",
      icon: "ti-login",
      color: "#090a09", // teal
      value: 8,
    },
    {
      label: "Pending Payment Request",
      icon: "ti-currency-rupee",
      color: "#090a09", // yellow
      value: 0,
    },
    {
      label: "Miss Punch Request",
      icon: "ti-logout",
      color: "#dc3545", // red
      value: 10,
    },
  ];

  const attendanceRow1 = [
    { label: "Total", value: 98, color: "#8000FF" },
    { label: "Present", value: 89, color: "#00B050" },
    { label: "Absent", value: 9, color: "#FF0000" },
    { label: "Half Day", value: 0, color: "#FFC000" },
  ];

  const attendanceRow2 = [
    { label: "Late Comers", value: 24, color: "#B266FF" },
    { label: "Early Leaving", value: 1, color: "#00B0F0" },
    { label: "On Break", value: 0, color: "#00FFFF" },
    { label: "On Leave", value: 0, color: "#FFD966" },
  ];

  const paymentSummary = [
    { label: "Old Balance", value: "-" },
    { label: "Payable Salary", value: "₹12,94,728" },
    { label: "Allowance & Bonus", value: "-" },
    { label: "Deduction", value: "₹25,500" },
    { label: "Net Payable", value: "₹12,69,228", highlight: true },
  ];

  const LoanList = [
    { label: "Loan Given", value: "2,75,000" },
    { label: "Loan Received", value: "₹4,74,800" },
    { label: "Loan balance", value: "3,70,000" },
  ];

  const advancePaymentList = [
    { label: "27/06/2025", value: "₹5,000" },
    { label: "28/06/2025", value: "₹1,000" },
    { label: "10/07/2025", value: "₹2,000" },
  ];

  const statutoryExpList = [
    { label: "PF", value: "₹57,960" },
    { label: "ESI", value: "₹10,000" },
    { label: "PT", value: "₹25,070" },
  ];

  const branchOptions = [
    { value: "all", label: "All" },
    { value: "nanded", label: "Nanded Phata" },
    { value: "vadgaon", label: "VADGAON" },
  ];

  const [selectedBranch, setSelectedBranch] = useState(branchOptions[0]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  return (
    <>
      {/* Page Wrapper */}

      <div className="page-wrapper mt-2">
        <div className="container mb-4">
          {/* branch selection dropdown*/}
          <div className="input-block w-100 d-flex align-items-center justify-content-flex-start gap-1" style={{ paddingLeft: 0, marginBottom: -10 }}>
            <h6 style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>Branch:</h6>
            <div style={{ width: "32%", borderColor: '#333' }}>
              <CommonSelect
                className="select"
                options={branchOptions}
                defaultValue={selectedBranch}
              />
            </div>
          </div>

          {/* row-1 attendance and Todo */}
          <div className="row g-3 mt-2 align-items-stretch">
            {/* Left Column - Attendance Card */}
            <div className="col-lg-8 col-12">
              <div className="p-3 bg-white rounded-3 shadow-sm d-flex flex-column justify-content-between h-100">
                {/* Attendance Header */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          backgroundColor: "#f4f1ff",  // light purple background
                          padding: "6px",              // adjust padding for better circle
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="ti ti-user"
                          style={{ fontSize: "24px", color: "#333" }}
                        ></i>
                      </div>
                      <div>
                        <h6 className="mb-0" style={{ fontSize: "16px", color: "#333", }}>Attendance</h6>
                        <small className="text-muted">
                          Report Center
                        </small>
                      </div>
                    </div>

                    {/* Calendar Section */}
                    <div
                      className="d-flex align-items-center justify-content-between rounded px-2"
                      style={{
                        border: "1px solid #E0E0E0",
                        backgroundColor: "#fff",
                      }}
                    >
                      <i className="ti ti-chevron-left text-primary" style={{ fontSize: "18px" }}></i>

                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="form-control text-center"
                        style={{
                          border: "none",
                          fontSize: "14px",
                          color: "#333",
                          width: "140px",
                        }}
                      />

                      <i className="ti ti-chevron-right text-primary" style={{ fontSize: "18px" }}></i>

      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Admin Dashboard####</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Admin Dashboard
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">
                <div className="dropdown">
                  <Link to="#"
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
              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}
          {/* Welcome Wrap */}
          {/* <div className="card border-0">
            <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-1">
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-xl flex-shrink-0">
                  <ImageWithBasePath
                    src="assets/img/profiles/avatar-31.jpg"
                    className="rounded-circle"
                    alt="img"
                  />
                </span>
                <div className="ms-3">
                  <h3 className="mb-2">
                    Welcome Back, Adrian{" "}
                    <Link to="#" className="edit-icon">
                      <i className="ti ti-edit fs-14" />
                    </Link>
                  </h3>
                  <p>
                    You have{" "}
                    <span className="text-primary text-decoration-underline">
                      21
                    </span>{" "}
                    Pending Approvals &amp;{" "}
                    <span className="text-primary text-decoration-underline">
                      14
                    </span>{" "}
                    Leave Requests
                  </p>
                </div>
              </div>
            </div>
          </div> */}
          {/* /Welcome Wrap */}
          <div className="row">
            {/* Widget Info */}
            <div className="col-xxl-8 d-flex">
              <div className="row flex-fill">
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="avatar rounded-circle bg-primary me-3">
                          <i className="ti ti-calendar-share fs-24 text-white" />
                        </span>

                        <div className="text-end">
                          <h6 className="fs-16 fw-semibold text-default mb-1">Total</h6>
                          <h3 className="fs-2 fw-bold mb-0">92</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="avatar rounded-circle bg-secondary me-3">
                          <i className="ti ti-browser fs-24 text-white" />
                        </span>

                        <div className="text-end">
                          <h6 className="fs-16 fw-semibold text-default mb-1">Present</h6>
                          <h3 className="fs-2 fw-bold mb-0">
                            90/94{" "}
                            <span className="fs-12 fw-medium text-danger">
                              <i className="fa-solid fa-caret-down me-1" />
                              -2.1%
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="avatar rounded-circle bg-info me-3">
                          <i className="ti ti-users-group fs-24 text-white" />
                        </span>

                        <div className="text-end">
                          <h6 className="fs-16 fw-semibold text-default mb-1">Absent</h6>
                          <h3 className="fs-2 fw-bold mb-0">
                            69/86{" "}
                            <span className="fs-12 fw-medium text-danger">
                              <i className="fa-solid fa-caret-down me-1" />
                              -11.2%
                            </span>
                          </h3>
                        </div>
                      </div>

                    </div>

                  </div>


                  {/*Full-Width Bottom Border */}
                  <div
                    style={{
                      margin: "0 -1rem", // cancels out the .p-3 padding
                      borderBottom: "1px solid #eee",
                    }}
                  />

                  {/* Attendance Summary */}
                  <div className="row mt-4 px-3">
                    {[
                      { label: "Total", value: 101, color: "#8000FF" },
                      { label: "Present", value: 87, color: "#00B050" },
                      { label: "Absent", value: 14, color: "#FF0000" },
                      { label: "Half Day", value: 0, color: "#FFC000" },
                      { label: "Late Comers", value: 19, color: "#B266FF" },
                      { label: "Early Leaving", value: 0, color: "#00B0F0" },
                      { label: "On Break", value: 0, color: "#00FFFF" },
                      { label: "On Leave", value: 0, color: "#FFD966" },
                    ].map((item, index) => {
                      const isLastColumn = index % 4 === 3;
                      const isFirstRow = index < 4;

                      return (
                        <div
                          key={index}
                          className="col-6 col-md-3 py-3 px-3"
                          style={{
                            borderRight: isLastColumn ? "none" : "1px solid #ccc",
                            borderBottom: isFirstRow ? "1px solid #ccc" : "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "14px",
                              color: item.color,
                              marginBottom: "1px",
                              fontWeight: 400,
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              fontSize: "38px",
                              fontWeight: 600,
                              color: item.color,
                            }}
                          >
                            {item.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/*Full-Width Bottom Border */}
                <div
                  style={{
                    margin: "0 -1rem", // cancels out the .p-3 padding
                    marginTop: '2.7%',
                    borderBottom: "1px solid #eee",
                  }}
                />
                {/* Footer */}
                <div className="text-end mt-3">
                  <a
                    href="#"
                    className="text-primary"
                    style={{ fontWeight: 500, fontSize: "16px" }}
                  >
                    Detailed Attendance View &nbsp;
                    <i className="ti ti-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - To Do */}
            <div className="col-lg-4 col-12">
              <div className="p-3 bg-white justify-content-between rounded-3 shadow-sm h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    style={{
                      backgroundColor: "#f4f1ff",  // light purple background
                      padding: "8px",              // adjust padding for better circle
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="ti ti-gift"
                      style={{ fontSize: "24px", color: "#6f42c1" }}
                    ></i>
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ fontSize: "16px", color: "#333", }}>To Do</h6>
                    <small className="text-muted">Today Work</small>
                  </div>
                </div>
                {/*Full-Width Bottom Border */}
                <div
                  style={{
                    margin: "0 -1rem", // cancels out the .p-3 padding
                    borderBottom: "1px solid #eee",
                  }}
                />
                <ul className="list-unstyled mb-0">
                  {todoItemList.map((item, index) => (
                    <li
                      key={index}
                      className="py-3"
                      style={{
                        borderBottom: "1px solid #eee",
                        margin: "0 -1rem", // cancels out the .p-3 padding
                      }}
                    >
                      <div className="px-3 d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2 ">
                          <i
                            className={`ti ${item.icon}`}
                            style={{ fontSize: "18px", color: item.color }}
                          ></i>
                          <span style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>
                            {item.label}
                          </span>
                        </div>
                        <span style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>
                          {item.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="avatar rounded-circle bg-pink me-3">
                          <i className="ti ti-checklist fs-24 text-white" />
                        </span>

                        <div className="text-end">
                          <h6 className="fs-16 fw-semibold text-default mb-1">Half Day</h6>
                          <h3 className="fs-2 fw-bold mb-0">
                            25/28{" "}
                            <span className="fs-12 fw-medium text-success">
                              <i className="fa-solid fa-caret-down me-1" />
                              +11.2%
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="avatar rounded-circle bg-purple me-3">
                          <i className="ti ti-moneybag fs-24 text-white" />
                        </span>

                        <div className="text-end">
                          <h6 className="fs-16 fw-semibold text-default mb-1">Late Commers</h6>
                          <h3 className="fs-2 fw-bold mb-0">
                            $2144{" "}
                            <span className="fs-12 fw-medium text-success">
                              <i className="fa-solid fa-caret-up me-1" />
                              +10.2%
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="avatar rounded-circle bg-danger me-3">
                          <i className="ti ti-browser fs-24 text-white" />
                        </span>

                        <div className="text-end">
                          <h6 className="fs-16 fw-semibold text-default mb-1">Early Leaving</h6>
                          <h3 className="fs-2 fw-bold mb-0">
                            $5,544{" "}
                            <span className="fs-12 fw-medium text-success">
                              <i className="fa-solid fa-caret-up me-1" />
                              +2.1%
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="avatar rounded-circle bg-success me-3">
                          <i className="ti ti-users-group fs-24 text-white" />
                        </span>

                        <div className="text-end">
                          <h6 className="fs-16 fw-semibold text-default mb-1">On Break</h6>
                          <h3 className="fs-2 fw-bold mb-0">
                            98{" "}
                            <span className="fs-12 fw-medium text-success">
                              <i className="fa-solid fa-caret-up me-1" />
                              +2.1%
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="avatar rounded-circle bg-dark me-3">
                          <i className="ti ti-user-star fs-24 text-white" />
                        </span>

                        <div className="text-end">
                          <h6 className="fs-16 fw-semibold text-default mb-1">On Leave</h6>
                          <h3 className="fs-2 fw-bold mb-0">
                            45/48{" "}
                            <span className="fs-12 fw-medium text-danger">
                              <i className="fa-solid fa-caret-down me-1" />
                              -11.2%
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* row-2 Payment and Loan Style Cards */}
          <div className="row g-3 mt-2 align-items-stretch">
            {/* Payment Card */}
            <div className="col-lg-6 col-12">
              <div className="bg-white rounded-3 shadow-sm p-3 d-flex flex-column justify-content-between h-100">

                {/* Payment Card - Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        backgroundColor: "#f4f1ff",  // light purple background
                        padding: "8px",              // adjust padding for better circle
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="ti ti-wallet"
                        style={{ fontSize: "24px", color: "#333" }} // adjust icon size & color
                      ></i>
                    </div>

                    <div>
                      <h6 className="mb-0" style={{ fontSize: "16px", color: "#333", }}>Payment</h6>
                      <small className="text-muted">
                        Staff Payment Summary
                      </small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "100%" }}
                    >
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "100%" }}
                    >
                      <option>2025 Jun</option>
                      <option>2025 May</option>
                    </select>
                  </div>
                </div>

                {/*Full-Width Bottom Border */}
                <div
                  style={{
                    margin: "0 -1rem", // cancels out the .p-3 padding
                    borderBottom: "1px solid #eee",
                  }}
                />
                {/* Summary List */}
                <ul className="list-unstyled mb-2 border-bottom">
                  {paymentSummary.map((item, index) => (
                    <li
                      key={index}
                      className={`${index !== paymentSummary.length - 1 ? 'border-bottom' : ''}`}
                      style={{
                        ...(item.highlight ? { backgroundColor: "#f4f1ff" } : {}),
                        borderBottom: "1px solid #eee",
                        margin: "0 -1rem", // expands full width under padding
                      }}
                    >
                      <div className="d-flex justify-content-between py-2 px-3">
                        <span style={{ ...(item.highlight ? { fontWeight: 600 } : {}), color: "#333", fontSize: "16px", fontWeight: 500 }}>
                          {item.label}
                        </span>
                        <span style={{ ...(item.highlight ? { fontWeight: 600 } : {}), color: "#333", fontSize: "16px", fontWeight: 500 }}>
                          {item.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="text-end mt-2">
                  <a
                    href="#"
                    className="text-primary"
                    style={{ fontSize: "14px" }}
                  >
                    View Details <i className="ti ti-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>


            {/* Loan Card */}
            <div className="col-lg-6 col-12">
              <div className="bg-white rounded-3 shadow-sm p-3 d-flex flex-column justify-content-between h-100">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      backgroundColor: "#f4f1ff",  // light purple background
                      padding: "8px",              // adjust padding for better circle
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="ti ti-building-bank"
                      style={{ fontSize: "24px", color: "#333" }}
                    ></i>
                  </div>
                  <div>
                    <h6 className="mb-0" style={{ fontSize: "16px", color: "#333", }}>Loan</h6>
                    <small className="text-muted">Summary of Loan</small>
                  </div>
                </div>
                {/*Full-Width Bottom Border */}
                <div
                  style={{
                    margin: "0 -1rem", // cancels out the .p-3 padding
                    borderBottom: "1px solid #eee",
                  }}
                />
                {/*loan item List */}
                <ul className="list-unstyled mb-2 border-bottom">
                  {LoanList.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        borderBottom: "1px solid #eee",
                        margin: "0 -1rem", // expands full width under padding
                      }}
                    >
                      <div className="d-flex justify-content-between py-3 px-3">
                        <span style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>
                          {item.label}
                        </span>
                        <span style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>
                          {item.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="text-end mt-1">
                  <a
                    href="#"
                    className="text-primary"
                    style={{ fontSize: "14px" }}
                  >
                    View Details <i className="ti ti-arrow-right"></i>
                  </a>

            {/* /Attendance Overview */}
            {/* Clock-In/Out */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
                  <h5 className="mb-2">Leave</h5>
                  <div className="d-flex gap-2">
                    <select
                      className="form-control"
                    >
                      <option value="All">ALL</option>
                    </select>
                    <input
                      type="date"
                      className="form-control"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                    <input
                      type="date"
                      className="form-control"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>

                </div>

                <div className="card-body" style={{ maxHeight: "450px", overflowY: "auto" }}>
                  {leaveRecords.length > 0 ? (
                    leaveRecords.map((record, index) => (
                      <div
                        className={`d-flex align-items-center justify-content-between mb-3 p-2 border ${record.status === "Rejected"
                          ? "border-danger"
                          : record.status === "Approved"
                            ? "border-success"
                            : "border-warning"
                          } br-5`}
                        key={index}
                      >
                        <div className="d-flex align-items-center">
                          <div className="avatar flex-shrink-0">
                            <img
                              src="/assets/img/profiles/default-avatar.jpg"
                              alt="avatar"
                              className="rounded-circle border border-2"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ms-2">
                            <h6 className="fs-14 fw-medium text-truncate mb-1">
                              {record.employee?.firstName} {record.employee?.lastName}
                            </h6>
                            <p className="fs-13 mb-0">
                              {new Date(record.fromDate).toLocaleDateString()} →{" "}
                              {new Date(record.toDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`badge fw-medium ${record.status === "Rejected"
                            ? "badge-danger"
                            : record.status === "Approved"
                              ? "badge-success"
                              : "badge-warning"
                            }`}
                        >
                          {record.status}
                        </span>

                        {/* <button className="btn btn-sm btn-link text-primary">
                          View
                        </button> */}

                        <Link to="#"
                          className="me-2"
                          onClick={() => setSelectedLeaveRecord(record)}
                          style={{ fontSize: "1.25rem" }}
                          data-bs-toggle="modal"
                          data-bs-target="#leave_details">
                          <i className="ti ti-eye" />
                        </Link>

                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No leave records found.</p>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* row-3 Advance Payment and Statutory Expenses */}
          <div className="row g-3 mt-2 align-items-stretch">
            {/* Advance Payment Card */}
            <div className="col-lg-6 col-12">
              <div className="bg-white rounded-3 shadow-sm p-3 d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          backgroundColor: "#f4f1ff",  // light purple background
                          padding: "8px",              // adjust padding for better circle
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="ti ti-currency-rupee"
                          style={{ fontSize: "24px", color: "#333" }}
                        ></i>
                      </div>
                      <div>
                        <h6 className="mb-0" style={{ fontSize: "16px", color: "#333", }}>Advance Payment</h6>
                        <small className="text-muted">
                          Summary of Advances
                        </small>
                      </div>
                    </div>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "120px" }}
                    >
                      <option>2025 Jun</option>
                      <option>2025 May</option>
                    </select>
                  </div>
                  {/*Full-Width Bottom Border */}
                  <div
                    style={{
                      margin: "0 -1rem", // cancels out the .p-3 padding
                      borderBottom: "1px solid #eee",
                    }}
                  />
                  {/* Table of dates and amounts */}
                  <ul className="list-unstyled mb-2 border-bottom">
                    {advancePaymentList.map((item, index) => (
                      <li
                        key={index}
                        style={{
                          borderBottom: "1px solid #eee",
                          margin: "0 -1rem", // expands full width under padding
                        }}
                      >
                        <div className="d-flex justify-content-between py-3 px-3">
                          <span style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>
                            {item.label}
                          </span>
                          <span style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>
                            {item.value}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="text-end mt-2">
                  <a
                    href="#"
                    className="text-primary"
                    style={{ fontSize: "14px" }}
                  >
                    View Details <i className="ti ti-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Statutory Expenses Card */}
            <div className="col-lg-6 col-12">
              <div className="bg-white rounded-3 shadow-sm p-3 d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          backgroundColor: "#f4f1ff",  // light purple background
                          padding: "8px",              // adjust padding for better circle
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="ti ti-receipt-tax"
                          style={{ fontSize: "24px", color: "#333" }}
                        ></i>
                      </div>
                      <div>
                        <h6 className="mb-0" style={{ fontSize: "16px", color: "#333", }}>Statutory Expenses</h6>
                        <small className="text-muted">Duties & Taxes</small>
                      </div>
                    </div>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "120px" }}
                    >
                      <option>2025 Jun</option>
                      <option>2025 May</option>
                    </select>
                  </div>
                  {/*Full-Width Bottom Border */}
                  <div
                    style={{
                      margin: "0 -1rem", // cancels out the .p-3 padding
                      borderBottom: "1px solid #eee",
                    }}
                  />
                  {/* Expense List */}
                  <ul className="list-unstyled mb-2 border-bottom">
                    {statutoryExpList.map((item, index) => (
                      <li
                        key={index}
                        style={{
                          borderBottom: "1px solid #eee",
                          margin: "0 -1rem", // expands full width under padding
                        }}
                      >
                        <div className="d-flex justify-content-between py-3 px-3">
                          <span style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>
                            {item.label}
                          </span>
                          <span style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>
                            {item.value}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="text-end mt-2">
                  <a
                    href="#"
                    className="text-primary"
                    style={{ fontSize: "14px" }}
                  >
                    View Details <i className="ti ti-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* /Page Wrapper */}
      <ProjectModals />
      <RequestModals />
      <TodoModal />



      {/* user Detail */}
      <div className="modal fade" id="leave_details">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Leave Request Details</h4>
              <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              {selectedLeaveRecord && (
                <>
                  {/* Header Info */}
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center rounded bg-light p-3">
                      <div className="file-name-icon d-flex align-items-center">
                        <div>
                          <p className="text-gray-9 fw-medium mb-0">
                            {selectedLeaveRecord.employee.firstName} {selectedLeaveRecord.employee.lastName}
                          </p>
                          <p>{selectedLeaveRecord.employee.email}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`badge fw-medium ${selectedLeaveRecord.status === 'Approved'
                          ? 'badge-success'
                          : selectedLeaveRecord.status === 'Rejected'
                            ? 'badge-danger'
                            : 'badge-warning'
                          }`}>
                          {selectedLeaveRecord.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="p-3">
                    <p className="text-gray-9 fw-medium">Leave Info</p>
                    <div className="pb-1 border-bottom mb-4">
                      <div className="row">
                        <div className="col-md-6">
                          <p className="fs-12 mb-0">Leave Type</p>
                          <p className="text-gray-9">{selectedLeaveRecord.leaveType}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="fs-12 mb-0">Total Days</p>
                          <p className="text-gray-9">{selectedLeaveRecord.totalDays}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="fs-12 mb-0">From - To</p>
                          <p className="text-gray-9">
                            {new Date(selectedLeaveRecord.fromDate).toLocaleDateString()} → {new Date(selectedLeaveRecord.toDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="fs-12 mb-0">Reason</p>
                          <p className="text-gray-9">{selectedLeaveRecord.reason}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="fs-12 mb-0">Applied On</p>
                          <p className="text-gray-9">{new Date(selectedLeaveRecord.createdAt).toLocaleString()}</p>
                        </div>
                        {selectedLeaveRecord.approver && (
                          <div className="col-md-6">
                            <p className="fs-12 mb-0">Approved/Rejected By</p>
                            <p className="text-gray-9">
                              {selectedLeaveRecord.approver.firstName} {selectedLeaveRecord.approver.lastName}
                            </p>
                          </div>
                        )}
                        {selectedLeaveRecord.remarks && (
                          <div className="col-md-12">
                            <p className="fs-12 mb-0">Remarks</p>
                            <p className="text-gray-9">{selectedLeaveRecord.remarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedLeaveRecord.status === 'Applied' && (
                    <div className="p-3 d-flex justify-content-end gap-2">
                      <button className="btn btn-danger" onClick={() => handleLeaveAction('Rejected')}>Reject</button>
                      <button className="btn btn-success" onClick={() => handleLeaveAction('Approved')}>Approve</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* /user Detail */}
    </>

  );
};

export default AdminDashboard;

