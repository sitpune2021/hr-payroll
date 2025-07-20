import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link, useNavigate } from "react-router-dom";
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
import { Branch } from "../../../core/data/redux/branchesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../core/data/redux/store";
import getAttendanceSummaryAdminDashStat, { SummaryItem } from "../../../utils/AttendanceStatAdminDash";
import { fetchCompanyDateAttendance } from "../../../core/data/redux/companyDateAttendanceSlice";
import { fetchCompanysUsersThunk } from "../../../core/data/redux/companysUsersSlice";

const AdminDashboard = () => {

  const dispatch = useDispatch<AppDispatch>();
  const nevigate = useNavigate();

  const routes = all_routes;

  const [isTodo, setIsTodo] = useState([false, false, false]);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [statSummary, setStatSumary] = useState<SummaryItem[]>([]);

  const [allBranches, setAllBranches] = useState<Branch[]>([])
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const user = useSelector((state: RootState) => state.auth.user);
  const branchList: Branch[] = useSelector((state: RootState) => state.branches.branches);
  const attendanceList = useSelector((state: RootState) => state.companyDateAttendance.data);
  const companyUserList = useSelector((state: RootState) => state.companysEmployees.list);
  const userSaved = useSelector((state: RootState) => state.auth.user);


  useEffect(() => {
    if (selectedBranch) {
      const branchUsers = companyUserList.filter((user) => user.branchId === selectedBranch.id)
      const userIds = branchUsers.map((user) => user.id);
      const branchAttendance = attendanceList.filter((att) =>
        userIds.includes(att.employeeId)
      );

      setStatSumary(getAttendanceSummaryAdminDashStat(branchUsers, branchAttendance));
    } else {
      setStatSumary(getAttendanceSummaryAdminDashStat(companyUserList, attendanceList));
    }
  }, [selectedBranch, companyUserList, attendanceList])



  useEffect(() => {
    if (userSaved?.companyId) {
      dispatch(fetchCompanyDateAttendance({ companyId: userSaved.companyId, date: selectedDate }));
      dispatch(fetchCompanysUsersThunk(userSaved.companyId));
    }
  }, [userSaved, selectedDate]);


  useEffect(() => {
    if (branchList.length > 0 && user?.companyId) {
      const loggedUsersBranches = branchList.filter(
        (branch) => branch.companyId === user?.companyId
      );

      if (user.companyId) {
        setAllBranches(loggedUsersBranches);
      } else {
        setAllBranches(branchList);
      }
    }

  }, [branchList, user?.companyId]);


  const [date, setDate] = useState(new Date());

  const formatDate = (date:any) => {
  return date.toISOString().split("T")[0];
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



  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper mt-2">
        <div className="container mb-4">
          {/* branch selection dropdown*/}
          <div className="input-block w-100 d-flex align-items-center justify-content-flex-start gap-1" style={{ paddingLeft: 0, marginBottom: -10 }}>
            <h6 style={{ color: "#333", fontSize: "16px", fontWeight: 500 }}>Branch:</h6>
            <div style={{ width: "32%", borderColor: '#333' }}>
              <select
                className="form-control"
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  const branch = allBranches.find(b => b.id === selectedId) || null;
                  setSelectedBranch(branch);
                }}
              >
                <option value="ALL">ALL</option>
                {
                  allBranches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))
                }
              </select>
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
                        width: "fit-content",
                      }}
                    >
                      <i
                        className="ti ti-chevron-left text-primary"
                        style={{ fontSize: "18px", cursor: "pointer" }}
                        onClick={() =>
                          setSelectedDate((prev) =>
                            formatDate(new Date(new Date(prev).setDate(new Date(prev).getDate() - 1)))
                          )
                        }
                      ></i>

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

                      <i
                        className="ti ti-chevron-right text-primary"
                        style={{ fontSize: "18px", cursor: "pointer" }}
                        onClick={() =>
                          setSelectedDate((prev) =>
                            formatDate(new Date(new Date(prev).setDate(new Date(prev).getDate() + 1)))
                          )
                        }
                      ></i>
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
                    {statSummary.map((item, index) => {
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
                  <button
                    onClick={() => nevigate("/attendance")}
                    className="p-0 m-0 border-0 bg-transparent text-primary"
                    style={{
                      fontWeight: 500,
                      fontSize: "16px",
                      outline: "none",
                      boxShadow: "none",
                      cursor: "pointer",
                    }}
                  >
                    Detailed Attendance View &nbsp;
                    <i className="ti ti-arrow-right"></i>
                  </button>
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
    </>

  );
};

export default AdminDashboard;

