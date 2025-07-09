import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../core/data/redux/store';
import { fetchCompanysUsersThunk } from '../../../core/data/redux/companysUsersSlice';
import { fetchCompanyDateAttendance } from '../../../core/data/redux/companyDateAttendanceSlice';
import axiosClient from '../../../axiosConfig/axiosClient';
import { PUNCH_ATTENDANCE } from '../../../axiosConfig/apis';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { all_routes } from '../../router/all_routes';
import ShiftAssignment from './ShiftAssignment';


const AttendanceAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userSaved = useSelector((state: RootState) => state.auth.user);
  const companyUserList = useSelector((state: RootState) => state.companysEmployees.list);
  const attendanceList = useSelector((state: RootState) => state.companyDateAttendance.data);

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loadingPunchEmpIds, setLoadingPunchEmpIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'attendance' | 'shift'>('attendance');

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

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return (
          <div className="card">
            <div className="card-header d-flex justify-content-between flex-wrap">
              <h5>Admin Attendance</h5>
              <div className="d-inline-flex">
                <input type="date" value={selectedDate} className="form-control me-2"
                  onChange={(e) => setSelectedDate(e.target.value)} />
                <input type="text" className="form-control" placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="card-body p-0">
              <table className="table datanew table-bordered bg-white">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
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
                        <td>{attendance?.isEarlyLeave || '-'}</td>
                        <td>{attendance?.workingHours || '-'}</td>
                        <td>{attendance?.overtimeHours || '-'}</td>
                        <td>
                          <div className="action-icon d-inline-flex">
                            <Link to="#"><i className="ti ti-edit me-2" /></Link>
                            <Link to="#"><i className="ti ti-trash" /></Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}><i className="ti ti-smart-home" /></Link>
              </li>
              <li className="breadcrumb-item">Employee</li>
              <li className="breadcrumb-item active">Attendance Admin</li>
            </ol>
          </div>
          <div className="btn-group">
            <button className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('attendance')}>Attendance</button>
            <button className={`btn ${activeTab === 'shift' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('shift')}>Shift Assign</button>
          </div>
          <div className="d-flex align-items-center flex-wrap">
            <div className="dropdown me-2 mb-2">
              <Link to="#" className="btn btn-white dropdown-toggle" data-bs-toggle="dropdown">
                <i className="ti ti-file-export me-1" /> Export
              </Link>
              <ul className="dropdown-menu dropdown-menu-end p-3">
                <li><Link to="#" className="dropdown-item"><i className="ti ti-file-type-pdf me-1" />Export as PDF</Link></li>
                <li><Link to="#" className="dropdown-item"><i className="ti ti-file-type-xls me-1" />Export as Excel</Link></li>
              </ul>
            </div>
            <div className="mb-2">
              <Link to="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#attendance_report">
                <i className="ti ti-file-analytics me-2" /> Report
              </Link>
            </div>
            <div className="ms-2">
              <CollapseHeader />
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
      <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
        <p className="mb-0">2014 - 2025 © SmartHR.</p>
        <p>Designed &amp; Developed by <Link to="#" className="text-primary">Dreams</Link></p>
      </div>
    </div>
  );
};

export default AttendanceAdmin;
