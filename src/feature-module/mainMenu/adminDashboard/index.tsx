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

const AdminDashboard = () => {
  const routes = all_routes;

  const [isTodo, setIsTodo] = useState([false, false, false]);

  const [date, setDate] = useState(new Date());

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
              <h2 className="mb-1">Admin Dashboard</h2>
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
              <div className="mb-2">
                <div className="input-icon w-120 position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-calendar text-gray-9" />
                  </span>
                  <Calendar value={date} onChange={(e: any) => setDate(e.value)} view="year" dateFormat="yy" className="Calendar-form" />
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
                      <span className="avatar rounded-circle bg-primary mb-2">
                        <i className="ti ti-calendar-share fs-16" /> 
                      </span>
                      <h6 className="fs-13 fw-medium text-default mb-1">
                       Total
                      </h6>
                      <h3 className="mb-3">
                        92
                        <span className="fs-12 fw-medium text-success">
                          <i className="fa-solid fa-caret-up me-1" />
                          +2.1%
                        </span>
                      </h3>
                      {/* <Link to="attendance-employee.html" className="link-default">
                        View Details
                      </Link> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="avatar rounded-circle bg-secondary mb-2">
                        <i className="ti ti-browser fs-16" />
                      </span>
                      <h6 className="fs-13 fw-medium text-default mb-1">
                        Present
                      </h6>
                      <h3 className="mb-3">
                        90/94{" "}
                        <span className="fs-12 fw-medium text-danger">
                          <i className="fa-solid fa-caret-down me-1" />
                          -2.1%
                        </span>
                      </h3>
                      {/* <Link to="projects.html" className="link-default">
                        View All
                      </Link> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="avatar rounded-circle bg-info mb-2">
                        <i className="ti ti-users-group fs-16" />
                      </span>
                      <h6 className="fs-13 fw-medium text-default mb-1">
                        Absent
                      </h6>
                      <h3 className="mb-3">
                        69/86{" "}
                        <span className="fs-12 fw-medium text-danger">
                          <i className="fa-solid fa-caret-down me-1" />
                          -11.2%
                        </span>
                      </h3>
                      {/* <Link to="clients.html" className="link-default">
                        View All
                      </Link> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="avatar rounded-circle bg-pink mb-2">
                        <i className="ti ti-checklist fs-16" />
                      </span>
                      <h6 className="fs-13 fw-medium text-default mb-1">
                        Half Day
                      </h6>
                      <h3 className="mb-3">
                        25/28{" "}
                        <span className="fs-12 fw-medium text-success">
                          <i className="fa-solid fa-caret-down me-1" />
                          +11.2%
                        </span>
                      </h3>
                      {/* <Link to="tasks.html" className="link-default">
                        View All
                      </Link> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="avatar rounded-circle bg-purple mb-2">
                        <i className="ti ti-moneybag fs-16" />
                      </span>
                      <h6 className="fs-13 fw-medium text-default mb-1">
                        Late Commers
                      </h6>
                      <h3 className="mb-3">
                        $2144{" "}
                        <span className="fs-12 fw-medium text-success">
                          <i className="fa-solid fa-caret-up me-1" />
                          +10.2%
                        </span>
                      </h3>
                      {/* <Link to="expenses.html" className="link-default">
                        View All
                      </Link> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="avatar rounded-circle bg-danger mb-2">
                        <i className="ti ti-browser fs-16" />
                      </span>
                      <h6 className="fs-13 fw-medium text-default mb-1">
                        Early Leaving
                      </h6>
                      <h3 className="mb-3">
                        $5,544{" "}
                        <span className="fs-12 fw-medium text-success">
                          <i className="fa-solid fa-caret-up me-1" />
                          +2.1%
                        </span>
                      </h3>
                      {/* <Link to="purchase-transaction.html" className="link-default">
                        View All
                      </Link> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="avatar rounded-circle bg-success mb-2">
                        <i className="ti ti-users-group fs-16" />
                      </span>
                      <h6 className="fs-13 fw-medium text-default mb-1">
                        On Break
                      </h6>
                      <h3 className="mb-3">
                        98{" "}
                        <span className="fs-12 fw-medium text-success">
                          <i className="fa-solid fa-caret-up me-1" />
                          +2.1%
                        </span>
                      </h3>
                      {/* <Link to="job-list.html" className="link-default">
                        View All
                      </Link> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="avatar rounded-circle bg-dark mb-2">
                        <i className="ti ti-user-star fs-16" />
                      </span>
                      <h6 className="fs-13 fw-medium text-default mb-1">
                        On Leave
                      </h6>
                      <h3 className="mb-3">
                        45/48{" "}
                        <span className="fs-12 fw-medium text-danger">
                          <i className="fa-solid fa-caret-down me-1" />
                          -11.2%
                        </span>
                      </h3>
                      {/* <Link to="candidates.html" className="link-default">
                        View All
                      </Link> */}
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
                  <h5 className="mb-2">Clock-In/Out</h5>
                  <div className="d-flex align-items-center">
                    <div className="dropdown mb-2">
                      <Link
                        to="#"
                        className="dropdown-toggle btn btn-white btn-sm d-inline-flex align-items-center border-0 fs-13 me-2"
                        data-bs-toggle="dropdown"
                      >
                        All Departments
                      </Link>
                      <ul className="dropdown-menu  dropdown-menu-end p-3">
                        <li>
                          <Link to="#"
                            className="dropdown-item rounded-1"
                          >
                            Finance
                          </Link>
                        </li>
                        <li>
                          <Link to="#"
                            className="dropdown-item rounded-1"
                          >
                            Development
                          </Link>
                        </li>
                        <li>
                          <Link to="#"
                            className="dropdown-item rounded-1"
                          >
                            Marketing
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="dropdown mb-2">
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
                  </div>
                </div>
                <div className="card-body">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3 p-2 border border-dashed br-5">
                      <div className="d-flex align-items-center">
                        <Link to="#"
                          className="avatar flex-shrink-0"
                        >
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-24.jpg"
                            className="rounded-circle border border-2"
                            alt="img"
                          />
                        </Link>
                        <div className="ms-2">
                          <h6 className="fs-14 fw-medium text-truncate">
                            Daniel Esbella
                          </h6>
                          <p className="fs-13">UI/UX Designer</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <Link to="#" className="link-default me-2">
                          <i className="ti ti-clock-share" />
                        </Link>
                        <span className="fs-10 fw-medium d-inline-flex align-items-center badge badge-success">
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          09:15
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-3 p-2 border br-5">
                      <div className="d-flex align-items-center">
                        <Link to="#"
                          className="avatar flex-shrink-0"
                        >
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-23.jpg"
                            className="rounded-circle border border-2"
                            alt="img"
                          />
                        </Link>
                        <div className="ms-2">
                          <h6 className="fs-14 fw-medium">Doglas Martini</h6>
                          <p className="fs-13">Project Manager</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <Link to="#" className="link-default me-2">
                          <i className="ti ti-clock-share" />
                        </Link>
                        <span className="fs-10 fw-medium d-inline-flex align-items-center badge badge-success">
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          09:36
                        </span>
                      </div>
                    </div>
                    <div className="mb-3 p-2 border br-5">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <Link to="#"
                            className="avatar flex-shrink-0"
                          >
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-27.jpg"
                              className="rounded-circle border border-2"
                              alt="img"
                            />
                          </Link>
                          <div className="ms-2">
                            <h6 className="fs-14 fw-medium text-truncate">
                              Brian Villalobos
                            </h6>
                            <p className="fs-13">PHP Developer</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <Link to="#"
                            className="link-default me-2"
                          >
                            <i className="ti ti-clock-share" />
                          </Link>
                          <span className="fs-10 fw-medium d-inline-flex align-items-center badge badge-success">
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            09:15
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap mt-2 border br-5 p-2 pb-0">
                        <div>
                          <p className="mb-1 d-inline-flex align-items-center">
                            <i className="ti ti-circle-filled text-success fs-5 me-1" />
                            Clock in
                          </p>
                          <h6 className="fs-13 fw-normal mb-2">10:30 AM</h6>
                        </div>
                        <div>
                          <p className="mb-1 d-inline-flex align-items-center">
                            <i className="ti ti-circle-filled text-danger fs-5 me-1" />
                            Clock Out
                          </p>
                          <h6 className="fs-13 fw-normal mb-2">09:45 AM</h6>
                        </div>
                        <div>
                          <p className="mb-1 d-inline-flex align-items-center">
                            <i className="ti ti-circle-filled text-warning fs-5 me-1" />
                            Production
                          </p>
                          <h6 className="fs-13 fw-normal mb-2">09:21 Hrs</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6 className="mb-2">Late</h6>
                  <div className="d-flex align-items-center justify-content-between mb-3 p-2 border border-dashed br-5">
                    <div className="d-flex align-items-center">
                      <span className="avatar flex-shrink-0">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-29.jpg"
                          className="rounded-circle border border-2"
                          alt="img"
                        />
                      </span>
                      <div className="ms-2">
                        <h6 className="fs-14 fw-medium text-truncate">
                          Anthony Lewis{" "}
                          <span className="fs-10 fw-medium d-inline-flex align-items-center badge badge-success">
                            <i className="ti ti-clock-hour-11 me-1" />
                            30 Min
                          </span>
                        </h6>
                        <p className="fs-13">Marketing Head</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Link to="#" className="link-default me-2">
                        <i className="ti ti-clock-share" />
                      </Link>
                      <span className="fs-10 fw-medium d-inline-flex align-items-center badge badge-danger">
                        <i className="ti ti-circle-filled fs-5 me-1" />
                        08:35
                      </span>
                    </div>
                  </div>
                  <Link to="attendance-report.html"
                    className="btn btn-light btn-md w-100"
                  >
                    View All Attendance
                  </Link>
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
    </>

  );
};

export default AdminDashboard;

