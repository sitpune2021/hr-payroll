import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../../router/all_routes';
import Table from "../../../../core/common/dataTable/index";
import CommonSelect from '../../../../core/common/commonSelect';
import { leaveadmin_details } from '../../../../core/data/json/leaveadmin_details';
import PredefinedDateRanges from '../../../../core/common/datePicker';
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
import { DatePicker } from 'antd';
import CollapseHeader from '../../../../core/common/collapse-header/collapse-header';
import { useAppDispatch, useAppSelector } from '../../../../core/data/redux/hooks';
import axiosClient from '../../../../axiosConfig/axiosClient';
import { COMPANY_LEAVES, UPDATE_LEAVE_STATUS } from '../../../../axiosConfig/apis';
import { fetchLeaves } from '../../../../core/data/redux/leavesSlice';
import { toast } from '../../../../utils/toastUtil';
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Approver {
  id: number;
  firstName: string;
  lastName: string;
}

interface Leave {
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
  employee: Employee;
  approver: Approver | null;
}

const LeaveAdmin = () => {
  const dispatch = useAppDispatch();
  const [filteredLeaves, setfilteredLeaves] = useState<Leave[]>([])
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null)

  const user = useAppSelector(state => state.auth.user)
  const { leaves } = useAppSelector((state) => state.companyLeaves);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [filterStatus, setStatusFilter] = useState("All");

  // Keep dates in local state
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 2); // 2 months ago
    return date.toISOString().split("T")[0]; // yyyy-mm-dd
  });

  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // today
  });


  useEffect(() => {
    if (filterStatus === 'All') {
      setfilteredLeaves(leaves)
      return;
    }
    const filLeaves = leaves.filter((leave) => leave.status === filterStatus);
    setfilteredLeaves(filLeaves)
  }, [filterStatus])


  useEffect(() => {
    if (user && user.companyId) {
      dispatch(fetchLeaves({ companyId: user.companyId, fromDate, toDate }));
    }
  }, [user, fromDate, toDate, dispatch]);

  const changeLeaveStatus = async (id: number, arg1: string) => {
    if(!user) return;
    try {
      const response = await axiosClient.post(UPDATE_LEAVE_STATUS, {
        "leaveId": id,
        "status": arg1,
        "approverId": user.id,
        "remarks": selectedLeave?.remarks
      })
      if(response.status===200){
        if(user && user.companyId) dispatch(fetchLeaves({ companyId: user.companyId, fromDate, toDate }));
        const closeBtn = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
                closeBtn?.click();
        toast('success','Leave updated successfully','success')
      }
    } catch (error) {
      console.log(error);

    }
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Leaves</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Employee</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leaves
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              {/* <div className="me-2 mb-2">
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
              </div> */}
              {/* <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal" data-inert={true}
                  data-bs-target="#add_leaves"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Add Leave
                </Link>
              </div> */}
              <div className="head-icons ms-2">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}

          {/* Leaves list */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h5>Leave List</h5>
              {/* <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
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
                    className="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Leave Type
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Medical Leave
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Casual Leave
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Annual Leave
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Sort By : Last 7 Days
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Recently Added
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Desending
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Last Month
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                      >
                        Last 7 Days
                      </Link>
                    </li>
                  </ul>
                </div>
              </div> */}

              {/* Filters */}
              <div className="d-flex mb-3 flex-wrap gap-2">
                <div className='d-flex'>
                  <label className="me-2">From:</label>
                  <input
                    className='form-control'
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className='d-flex'>
                  <label className="ms-3 me-2">To:</label>
                  <input
                    type="date"
                    className='form-control'
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="ms-3 me-2">Status:</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    value={filterStatus}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Applied">Applied</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {/* <Table dataSource={data} columns={columns} Selection={true} /> */}
              {/* Table */}
              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Total Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Approver</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center">
                          No leave records found.
                        </td>
                      </tr>
                    ) : (
                      filteredLeaves.map((leave, idx) => (
                        <tr key={leave.id}>
                          <td>{idx + 1}</td>
                          <td>
                            {leave.employee.firstName} {leave.employee.lastName}
                          </td>
                          <td>{leave.leaveType}</td>
                          <td>{leave.fromDate}</td>
                          <td>{leave.toDate}</td>
                          <td>{leave.totalDays}</td>
                          <td>{leave.reason}</td>
                          <td>
                            <span
                              className={`badge ${leave.status === "Approved"
                                ? "bg-success"
                                : leave.status === "Rejected"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                                }`}
                            >
                              {leave.status}
                            </span>
                          </td>
                          <td>
                            {leave.approver
                              ? `${leave.approver.firstName} ${leave.approver.lastName}`
                              : "-"}
                          </td>
                          <td>{leave.remarks ?? "-"}</td>
                          <td>
                            <div className="action-icon d-inline-flex">
                              {/* <Link to="#" className="me-2" data-bs-toggle="modal" data-bs-target="#company_detail">
                                                                                          <i className="ti ti-eye" />
                                                                                      </Link> */}
                              <button
                                onClick={() => setSelectedLeave(leave)}
                                className="me-2" data-bs-toggle="modal" data-bs-target="#edit_leaves">
                                <i className="ti ti-edit" />
                              </button>
                              {/* <Link to="#" data-bs-toggle="modal" data-bs-target="#delete_modal">
                                <i className="ti ti-trash" />
                              </Link> */}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* /Leaves list */}
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
      {/* Add Leaves */}
      {/* <div className="modal fade" id="add_leaves">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Leave</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body pb-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Employee Name</label>
                      <CommonSelect
                        className='select'
                        options={employeename}
                        defaultValue={employeename[0]}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Leave Type</label>
                      <CommonSelect
                        className='select'
                        options={leavetype}
                        defaultValue={leavetype[0]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">From </label>
                      <div className="input-icon-end position-relative">
                        <DatePicker
                          className="form-control datetimepicker"
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          getPopupContainer={getModalContainer}
                          placeholder="DD-MM-YYYY"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">To </label>
                      <div className="input-icon-end position-relative">
                        <DatePicker
                          className="form-control datetimepicker"
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          getPopupContainer={getModalContainer}
                          placeholder="DD-MM-YYYY"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="input-icon-end position-relative">
                        <DatePicker
                          className="form-control datetimepicker"
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          getPopupContainer={getModalContainer}
                          placeholder="DD-MM-YYYY"
                        />
                        <span className="input-icon-addon">
                          <i className="ti ti-calendar text-gray-7" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <CommonSelect
                        className='select'
                        options={selectChoose}
                        defaultValue={selectChoose[0]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">No of Days</label>
                      <input type="text" className="form-control" disabled />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Remaining Days</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={8}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Reason</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        defaultValue={""}
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
                <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                  Add Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> */}
      {/* /Add Leaves */}
      {/* Edit Leaves */}
      <div className="modal fade" id="edit_leaves">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Leave</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>

            {/* Leave details */}
            {
              selectedLeave && (
                <div className="modal-body">
                  <p><b>Employee:</b> {selectedLeave.employee.firstName} {selectedLeave.employee.lastName}</p>
                  <p><b>Leave Type:</b> {selectedLeave.leaveType}</p>
                  <p><b>From:</b> {selectedLeave.fromDate}</p>
                  <p><b>To:</b> {selectedLeave.toDate}</p>
                  <p><b>Total Days:</b> {selectedLeave.totalDays}</p>
                  <p><b>Reason:</b> {selectedLeave.reason}</p>
                  <p><b>Status:</b> {selectedLeave.status}</p>

                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={selectedLeave.remarks || ""}
                      onChange={(e) => setSelectedLeave({...selectedLeave,remarks:e.target.value})}
                    />
                  </div>
                </div>
              )
            }


            {/* Footer actions */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              {/* Reject Button */}
              {
                selectedLeave && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger mx-2"
                      onClick={() => changeLeaveStatus(selectedLeave?.id, "Rejected")}
                    >
                      Reject
                    </button>

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => changeLeaveStatus(selectedLeave?.id, "Approved")}
                    >
                      Approve
                    </button>
                  </>
                )
              }



            </div>
          </div>
        </div>
      </div>
      {/* Edit Leaves */}
    </>


  )
}

export default LeaveAdmin
