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




  return (
    <>
      {/* Page Wrapper */}
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
            {/* /Widget Info */}
          </div>
          <div className="row">
            {/* Attendance Overview */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
                  <h5 className="mb-2">Attendance Overview</h5>
                  <div className="dropdown mb-2">
                    <Link to="#"
                      className="btn btn-white border btn-sm d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-calendar me-1" />
                      Today
                    </Link>
                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                      <li>
                        <Link to="#"
                          className="dropdown-item rounded-1"
                        >
                          This Month
                        </Link>
                      </li>
                      <li>
                        <Link to="#"
                          className="dropdown-item rounded-1"
                        >
                          This Week
                        </Link>
                      </li>
                      <li>
                        <Link to="#"
                          className="dropdown-item rounded-1"
                        >
                          Today
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="chartjs-wrapper-demo position-relative mb-4">
                    <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full attendence-chart md:w-30rem" />
                    <div className="position-absolute text-center attendance-canvas">
                      <p className="fs-13 mb-1">Total Attendance</p>
                      <h3>120</h3>
                    </div>
                  </div>
                  <h6 className="mb-3">Status</h6>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="f-13 mb-2">
                      <i className="ti ti-circle-filled text-success me-1" />
                      Present
                    </p>
                    <p className="f-13 fw-medium text-gray-9 mb-2">59%</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="f-13 mb-2">
                      <i className="ti ti-circle-filled text-secondary me-1" />
                      Late
                    </p>
                    <p className="f-13 fw-medium text-gray-9 mb-2">21%</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="f-13 mb-2">
                      <i className="ti ti-circle-filled text-warning me-1" />
                      Permission
                    </p>
                    <p className="f-13 fw-medium text-gray-9 mb-2">2%</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <p className="f-13 mb-2">
                      <i className="ti ti-circle-filled text-danger me-1" />
                      Absent
                    </p>
                    <p className="f-13 fw-medium text-gray-9 mb-2">15%</p>
                  </div>
                  <div className="bg-light br-5 box-shadow-xs p-2 pb-0 d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center">
                      <p className="mb-2 me-2">Total Absenties</p>
                      <div className="avatar-list-stacked avatar-group-sm mb-2">
                        <span className="avatar avatar-rounded">
                          <ImageWithBasePath
                            className="border border-white"
                            src="assets/img/profiles/avatar-27.jpg"
                            alt="img"
                          />
                        </span>
                        <span className="avatar avatar-rounded">
                          <ImageWithBasePath
                            className="border border-white"
                            src="assets/img/profiles/avatar-30.jpg"
                            alt="img"
                          />
                        </span>
                        <span className="avatar avatar-rounded">
                          <ImageWithBasePath src="assets/img/profiles/avatar-14.jpg" alt="img" />
                        </span>
                        <span className="avatar avatar-rounded">
                          <ImageWithBasePath src="assets/img/profiles/avatar-29.jpg" alt="img" />
                        </span>
                        <Link
                          className="avatar bg-primary avatar-rounded text-fixed-white fs-10"
                          to="#"
                        >
                          +1
                        </Link>
                      </div>
                    </div>
                    <Link to="leaves.html"
                      className="fs-13 link-primary text-decoration-underline mb-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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
            {/* /Clock-In/Out */}
          </div>
          <div className="row">
            {/* Employees */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
                  <h5 className="mb-2">Employees</h5>
                  <Link to="employees.html" className="btn btn-light btn-md mb-2">
                    View All
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link to="#" className="avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-32.jpg"
                                  className="img-fluid rounded-circle"
                                  alt="img"
                                />
                              </Link>
                              <div className="ms-2">
                                <h6 className="fw-medium">
                                  <Link to="#">Anthony Lewis</Link>
                                </h6>
                                <span className="fs-12">Finance</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-secondary-transparent badge-xs">
                              Finance
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link to="#" className="avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-09.jpg"
                                  className="img-fluid rounded-circle"
                                  alt="img"
                                />
                              </Link>
                              <div className="ms-2">
                                <h6 className="fw-medium">
                                  <Link to="#">Brian Villalobos</Link>
                                </h6>
                                <span className="fs-12">PHP Developer</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-danger-transparent badge-xs">
                              Development
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link to="#" className="avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-01.jpg"
                                  className="img-fluid rounded-circle"
                                  alt="img"
                                />
                              </Link>
                              <div className="ms-2">
                                <h6 className="fw-medium">
                                  <Link to="#">Stephan Peralt</Link>
                                </h6>
                                <span className="fs-12">Executive</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-info-transparent badge-xs">
                              Marketing
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link to="#" className="avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-34.jpg"
                                  className="img-fluid rounded-circle"
                                  alt="img"
                                />
                              </Link>
                              <div className="ms-2">
                                <h6 className="fw-medium">
                                  <Link to="#">Doglas Martini</Link>
                                </h6>
                                <span className="fs-12">Project Manager</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-purple-transparent badge-xs">
                              Manager
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="border-0">
                            <div className="d-flex align-items-center">
                              <Link to="#" className="avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-37.jpg"
                                  className="img-fluid rounded-circle"
                                  alt="img"
                                />
                              </Link>
                              <div className="ms-2">
                                <h6 className="fw-medium">
                                  <Link to="#">Anthony Lewis</Link>
                                </h6>
                                <span className="fs-12">UI/UX Designer</span>
                              </div>
                            </div>
                          </td>
                          <td className="border-0">
                            <span className="badge badge-pink-transparent badge-xs">
                              UI/UX Design
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* /Employees */}
            {/* Todo */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
                  <h5 className="mb-2">Todo</h5>
                  <div className="d-flex align-items-center">
                    <div className="dropdown mb-2 me-2">
                      <Link
                        to="#"
                        className="btn btn-white border btn-sm d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                      >
                        <i className="ti ti-calendar me-1" />
                        Today
                      </Link>
                      <ul className="dropdown-menu  dropdown-menu-end p-3">
                        <li>
                          <Link to="#"
                            className="dropdown-item rounded-1"
                          >
                            This Month
                          </Link>
                        </li>
                        <li>
                          <Link to="#"
                            className="dropdown-item rounded-1"
                          >
                            This Week
                          </Link>
                        </li>
                        <li>
                          <Link to="#"
                            className="dropdown-item rounded-1"
                          >
                            Today
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <Link to="#"
                      className="btn btn-primary btn-icon btn-xs rounded-circle d-flex align-items-center justify-content-center p-0 mb-2"
                      data-bs-toggle="modal" data-inert={true}
                      data-bs-target="#add_todo"
                    >
                      <i className="ti ti-plus fs-16" />
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className={`d-flex align-items-center todo-item border p-2 br-5 mb-2 ${isTodo[0] ? 'todo-strike' : ''}`}>
                    <i className="ti ti-grid-dots me-2" />
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="todo1"
                        onChange={() => toggleTodo(0)}
                      />
                      <label className="form-check-label fw-medium" htmlFor="todo1">
                        Add Holidays
                      </label>
                    </div>
                  </div>
                  <div className={`d-flex align-items-center todo-item border p-2 br-5 mb-2 ${isTodo[1] ? 'todo-strike' : ''}`}>
                    <i className="ti ti-grid-dots me-2" />
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="todo2"
                        onChange={() => toggleTodo(1)}
                      />
                      <label className="form-check-label fw-medium" htmlFor="todo2">
                        Add Meeting to Client
                      </label>
                    </div>
                  </div>
                  <div className={`d-flex align-items-center todo-item border p-2 br-5 mb-2 ${isTodo[2] ? 'todo-strike' : ''}`}>
                    <i className="ti ti-grid-dots me-2" />
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="todo3"
                        onChange={() => toggleTodo(2)}
                      />
                      <label className="form-check-label fw-medium" htmlFor="todo3">
                        Chat with Adrian
                      </label>
                    </div>
                  </div>
                  <div className={`d-flex align-items-center todo-item border p-2 br-5 mb-2 ${isTodo[3] ? 'todo-strike' : ''}`}>
                    <i className="ti ti-grid-dots me-2" />
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="todo4"
                        onChange={() => toggleTodo(3)}
                      />
                      <label className="form-check-label fw-medium" htmlFor="todo4">
                        Management Call
                      </label>
                    </div>
                  </div>
                  <div className={`d-flex align-items-center todo-item border p-2 br-5 mb-2 ${isTodo[4] ? 'todo-strike' : ''}`}>
                    <i className="ti ti-grid-dots me-2" />
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="todo5"
                        onChange={() => toggleTodo(4)}
                      />
                      <label className="form-check-label fw-medium" htmlFor="todo5">
                        Add Payroll
                      </label>
                    </div>
                  </div>
                  <div className={`d-flex align-items-center todo-item border p-2 br-5 mb-2 ${isTodo[5] ? 'todo-strike' : ''}`}>
                    <i className="ti ti-grid-dots me-2" />
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="todo6"
                        onChange={() => toggleTodo(5)}
                      />
                      <label className="form-check-label fw-medium" htmlFor="todo6">
                        Add Policy for Increment{" "}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Todo */}
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

