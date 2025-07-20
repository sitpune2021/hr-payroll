import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../core/data/redux/store';
import { CompanyUser, fetchCompanysUsersThunk } from '../../../core/data/redux/companysUsersSlice';
import { Branch } from '../../../core/data/redux/branchesSlice';
import axios from 'axios';
import { Shift } from '../../../core/data/redux/shiftSlice';
import axiosClient from '../../../axiosConfig/axiosClient';
import { ASSIGN_SHIFT_TO_EMPLOYEE_FROM_DT_to_dt } from '../../../axiosConfig/apis';
import { toast } from '../../../utils/toastUtil';

type AssignedShifts = {
  [employeeId: number]: number | '';
};

type DateRanges = {
  [employeeId: number]: {
    fromDate: string;
    toDate: string;
  };
};

const ShiftAssignment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [employees, setEmployees] = useState<CompanyUser[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignedShifts, setAssignedShifts] = useState<AssignedShifts>({});
  const [dateRanges, setDateRanges] = useState<DateRanges>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const companyUserList = useSelector((state: RootState) => state.companysEmployees.list);
  const userSaved = useSelector((state: RootState) => state.auth.user);
  const allShifts = useSelector((state: RootState) => state.shifts.shifts);
  const branchList: Branch[] = useSelector((state: RootState) => state.branches.branches);

  useEffect(() => {
    if (userSaved?.companyId) {
      dispatch(fetchCompanysUsersThunk(userSaved.companyId));
    }
  }, [userSaved, dispatch]);

  useEffect(() => {
    setEmployees(companyUserList);

    const initialAssignments: AssignedShifts = {};
    const initialDates: DateRanges = {};

    companyUserList.forEach(emp => {
      initialAssignments[emp.id] = emp.workingShift || '';
      initialDates[emp.id] = {
        fromDate: '',
        toDate: '',
      };
    });

    setAssignedShifts(initialAssignments);
    setDateRanges(initialDates);
  }, [companyUserList]);

  useEffect(() => {
    if (userSaved?.companyId && allShifts.length > 0) {
      const filteredShifts = allShifts.filter(shift => shift.companyId === userSaved.companyId);
      setShifts(filteredShifts);
    }
  }, [allShifts, userSaved]);

  const getShiftLabel = (id: number | null): string => {
    const shift = shifts.find(s => s.id === id);
    return shift ? `${shift.shiftName} (${shift.checkInTime} - ${shift.checkOutTime})` : 'Not Assigned';
  };

  const handleShiftChange = (empId: number, shiftId: number) => {
    setAssignedShifts(prev => ({
      ...prev,
      [empId]: shiftId,
    }));
  };

  const handleDateChange = (empId: number, field: 'fromDate' | 'toDate', value: string) => {
    setDateRanges(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: value,
      }
    }));
  };

  const handleSave = async (empId: number) => {
    const selectedShift = assignedShifts[empId];
    const { fromDate, toDate } = dateRanges[empId];

    if (!selectedShift || !fromDate || !toDate) {
      alert("Please select shift and date range.");
      return;
    }

    try {
      const response = await axiosClient.post(ASSIGN_SHIFT_TO_EMPLOYEE_FROM_DT_to_dt, {
        userId: empId,
        attendanceSettingId: selectedShift,
        fromDate,
        toDate,
      });

      if (response.status === 201) {
        toast('info', "Shift assigned successfully", 'success');
      }
    } catch (error) {
             toast('Error', "Error While assign ahift, Please try after some time.", 'danger');
    }
  };

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-bordered table-sm align-middle">
          <thead className="table-light">
            <tr>
              <th>Employee</th>
              <th>Designation</th>
              <th>Assign New Shift</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.firstName} {emp.lastName}</td>
                <td>{emp.designation}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={assignedShifts[emp.id] || ''}
                    onChange={(e) => handleShiftChange(emp.id, parseInt(e.target.value))}
                  >
                    <option value="">-- Select Shift --</option>
                    {shifts.map(shift => (
                      <option className='form-control-sm' key={shift.id} value={shift.id}>
                        {shift.shiftName} ({shift.checkInTime} - {shift.checkOutTime})
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={dateRanges[emp.id]?.fromDate || ''}
                    onChange={(e) => handleDateChange(emp.id, 'fromDate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={dateRanges[emp.id]?.toDate || ''}
                    onChange={(e) => handleDateChange(emp.id, 'toDate', e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleSave(emp.id)}
                    disabled={!assignedShifts[emp.id] || !dateRanges[emp.id]?.fromDate || !dateRanges[emp.id]?.toDate}
                  >
                    Save
                  </button>

                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#add_shift"
                    className="btn btn-sm btn-success mx-1"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* assign shift */}
      <form >
        <div className="modal fade" id="add_shift">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Employee Name</h4>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  />

                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ maxWidth: "200px" }}
                  />


                </div>
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
                  {/* Shift Name */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Shift Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text" name="shiftName"
                        required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Company <span className="text-danger">*</span>
                      </label>
                      <select
                        name="companyId"
                      >
                        <option value="">--Select Company--</option>

                      </select>

                    </div>
                  </div>

                  {/* company selection */}

                  {/* Check-in Time */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Check-In Time <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="time"
                        name="checkInTime"
                        required />
                    </div>
                  </div>

                  {/* Check-out Time */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Check-Out Time <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="time" name="checkOutTime"
                        required />
                    </div>
                  </div>

                  {/* Grace Period */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Grace Period (minutes)
                      </label>
                      <input
                        className="form-control"
                        type="number" name="gracePeriodMinutes"
                        defaultValue={10} />
                    </div>
                  </div>

                  {/* Early Leave Allowance */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Early Leave Allowance (minutes)
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        name="earlyLeaveAllowanceMinutes"
                        defaultValue={10} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* /Add Shift */}

    </div>

  );
};

export default ShiftAssignment;
