import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as  XLSX from 'xlsx';
import { AppDispatch, RootState } from '../../../core/data/redux/store';
import { fetchCompanysUsersThunk } from '../../../core/data/redux/companysUsersSlice';
import { fetchCompanyDateAttendance } from '../../../core/data/redux/companyDateAttendanceSlice';
import axiosClient from '../../../axiosConfig/axiosClient';
import { PUNCH_ATTENDANCE, UPLOAD_ATTENDANCE_EXCEL } from '../../../axiosConfig/apis';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { all_routes } from '../../router/all_routes';
import ShiftAssignment from './ShiftAssignment';
import { toast } from '../../../utils/toastUtil';
import axios, { formToJSON } from 'axios';


const AttendanceAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userSaved = useSelector((state: RootState) => state.auth.user);
  const companyUserList = useSelector((state: RootState) => state.companysEmployees.list);
  const attendanceList = useSelector((state: RootState) => state.companyDateAttendance.data);

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loadingPunchEmpIds, setLoadingPunchEmpIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'attendance' | 'shift'>('attendance');

  const [uploadExcelFileData, setUploadExcelFileData] = useState<File | null>(null);


  useEffect(() => {
    if (userSaved?.companyId) {
      dispatch(fetchCompanyDateAttendance({ companyId: userSaved.companyId, date: selectedDate }));
      dispatch(fetchCompanysUsersThunk(userSaved.companyId));
    }
  }, [userSaved, selectedDate]);

  const handlePunchClick = async (empId: number) => {
    const now = new Date();
    const selected = new Date(selectedDate);
    const punchDatetime = new Date(
      selected.getFullYear(), selected.getMonth(), selected.getDate(),
      now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()
    );

    setLoadingPunchEmpIds(prev => [...prev, empId]);

    try {
      await axiosClient.post(PUNCH_ATTENDANCE, {
        employeeId: empId,
        punchDatetime: punchDatetime.toISOString(),
      });
      if (userSaved?.companyId) {
        dispatch(fetchCompanyDateAttendance({ companyId: userSaved.companyId, date: selectedDate }));
      }
    } catch (error) {
      console.error("Punch Error:", error);
    } finally {
      setLoadingPunchEmpIds(prev => prev.filter(id => id !== empId));
    }
  };


  const allowedStatuses = ["Present", "Unscheduled", "Absent", "Half-Day", "Leave"];

  interface AttendanceRow {
    employeeId: number;
    date?: string;
    checkIn?: string;
    checkOut?: string;
    status?: string;
    isLate?: string;
    isEarlyLeave?: string;
    remarks?: string;
  }

  const handleFileUpload = async () => {
    const file = uploadExcelFileData;
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: AttendanceRow[] = XLSX.utils.sheet_to_json(sheet);

    const errors: any[] = [];
    const validRows: AttendanceRow[] = [];

    rows.forEach((row, index) => {
      const rowIndex = index + 2;
      let hasError = false;
      let rowError: any = { Row: rowIndex };

      // Validate employeeId
      if (!row.employeeId || typeof row.employeeId !== "number") {
        rowError.employeeId = "Invalid or missing employeeId";
        hasError = true;
      }

      // Validate date
      if (!row.date || isNaN(Date.parse(row.date))) {
        rowError.date = "Invalid or missing date";
        hasError = true;
      }

      const hasTime = row.checkIn && row.checkOut;
      const hasStatus = row.status;

      if (!hasTime && !hasStatus) {
        rowError.attendance = "Either checkIn/checkOut or status is required";
        hasError = true;
      }

      // Validate status
      if (row.status && !allowedStatuses.includes(row.status)) {
        rowError.status = "Invalid status";
        hasError = true;
      }

      if (hasError) {
        errors.push({ ...row, ...rowError });
      } else {
        validRows.push(row);
      }
    });

    if (errors.length > 0) {
      // Generate Excel with errors
      const worksheet = XLSX.utils.json_to_sheet(errors);
      const errorWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(errorWorkbook, worksheet, "ErrorRows");
      const excelBuffer = XLSX.write(errorWorkbook, { type: "array", bookType: "xlsx" });

      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "attendance_upload_errors.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return;
    }

    // Proceed to upload
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosClient.post(UPLOAD_ATTENDANCE_EXCEL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      if (response.status === 200) {
        toast('info', response.data.message, 'success');
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };




  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return (
          <div>
            <div className="row">
              {/* Total Companies */}
              <div className="col-lg-2 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-md bg-primary flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <div className="ms-1 overflow-hidden">
                        <p className="fs-16 fw-medium mb-1 text-truncate">
                          Total
                        </p>
                        <h4>120</h4>
                      </div>
                    </div>
                    {/* <ReactApexChart
                      options={totalChart}
                      series={totalChart.series}
                      type="area"
                      width={50}
                    /> */}
                  </div>
                </div>
              </div>
              {/* /Total Companies */}
              {/* Total Companies */}
              <div className="col-lg-2 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-md bg-success flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-16 fw-medium mb-1 text-truncate">
                          Present
                        </p>
                        <h4>9</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Total Companies */}
              {/* Inactive Companies */}
              <div className="col-lg-2 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-md bg-danger flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-16 fw-medium mb-1 text-truncate">
                          Absent
                        </p>
                        <h4>30</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Inactive Companies */}
              {/* Company Location */}
              <div className="col-lg-2 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-md bg-purple flex-shrink-0">
                        <i className="ti ti-map-pin-check fs-16" />
                      </span>
                      <div className="ms-1 overflow-hidden">
                        <p className="fs-16 fw-medium mb-1 text-truncate">
                          On Leave
                        </p>
                        <h4>13</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-md bg-skyblue flex-shrink-0">
                        <i className="ti ti-map-pin-check fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-16 fw-medium mb-1 text-truncate">
                          Half Day
                        </p>
                        <h4>13</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-md bg-pink flex-shrink-0">
                        <i className="ti ti-map-pin-check fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-16 fw-medium mb-1 text-truncate">
                          On Break
                        </p>
                        <h4>13</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Company Location */}
            </div>
            <div className="card">
              <div className="card-header d-flex flex-wrap" style={{ alignItems: 'center' }}>
                <h5>Search Employee</h5>
                <input style={{ maxWidth: "320px" }} type="text" className="form-control ms-4" placeholder="Search Employees..."
                  onChange={(e) => setSearchTerm(e.target.value)} />
                {/* <div className="d-inline-flex">
                </div> */}

                <label
                  className="btn btn-secondary d-flex align-items-center mb-0 mx-3"
                  data-bs-toggle="modal"
                  data-inert={true}
                  data-bs-target="#upload_excel_model"

                >
                  <i className="fa fa-upload me-2" />
                  Upload Attendance Excel
                </label>
              </div>
              <div className="card-body p-0">
                <table className="table datanew table-bordered bg-white">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Status</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Break</th>
                      <th>Late</th>
                      <th>Early Leave</th>
                      <th>Production Hours</th>
                      <th>Over Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyUserList.filter(emp =>
                      (`${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).map(emp => {
                      const attendance = attendanceList.find(a => a.employeeId === emp.id);
                      return (
                        <tr key={emp.id}>
                          <td>{emp.firstName} {emp.lastName}</td>
                          <td>{attendance?.status || 'No Record'}</td>
                          <td>
                            {attendance?.checkIn || (
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => handlePunchClick(emp.id)}
                                disabled={loadingPunchEmpIds.includes(emp.id)}
                              >Clock-In</button>
                            )}
                          </td>
                          <td>
                            {attendance?.checkOut ? attendance.checkOut :
                              attendance?.checkIn ? (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handlePunchClick(emp.id)}
                                  disabled={loadingPunchEmpIds.includes(emp.id)}
                                >Clock-Out</button>
                              ) : '-'}
                          </td>
                          <td>{attendance?.isLate || '-'}</td>
                          <td>{attendance?.isLate || '-'}</td>
                          <td>{attendance?.isEarlyLeave || '-'}</td>
                          <td>{attendance?.workingHours || '-'}</td>
                          <td>{attendance?.overtimeHours || '-'}</td>
                          <td>
                            <div className="action-icon d-inline-flex">
                              <Link to="#"><i className="ti ti-edit me-2" /></Link>
                              <Link to="#"><i className="ti ti-trash" /></Link>
                              <Link to="#"><i className="ti ti-eye" /></Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'shift':
        return <ShiftAssignment />;
      default:
        return null;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
          <div className="my-auto mb-2">
            <h2 className="mb-1">Attendance Admin</h2>

          </div>
          <div className="btn-group">
            <button className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('attendance')}>Attendance</button>
            <button className={`btn ${activeTab === 'shift' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('shift')}>Shift Assign</button>
          </div>
          <div className="d-flex align-items-center flex-wrap">
            <input style={{ width: '120px' }} type="date" value={selectedDate} className="form-control me-2"
              onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
        </div>

        {renderContent()}
      </div>
      <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
        <p className="mb-0">2025 © PayBook</p>
        <p>Designed &amp; Developed by <Link to="#" className="text-primary">PayBook</Link></p>
      </div>





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
                  onClick={handleFileUpload}
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
    </div>
  );
};

export default AttendanceAdmin;
