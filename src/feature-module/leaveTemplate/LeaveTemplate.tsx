import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CollapseHeader from '../../core/common/collapse-header/collapse-header'
import { all_routes } from '../router/all_routes'
import { Company } from '../../core/data/redux/companySlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../core/data/redux/store'
import { useAppSelector } from '../../core/data/redux/hooks'
import { fetchHolidayGroups, HolidayGroup } from '../../core/data/redux/holidayGroupSlice'
import { holiday } from '../../core/data/json/holiday'
import axiosClient from '../../axiosConfig/axiosClient'
import { ADD_NEW_LEAVE_TEMPLATE } from '../../axiosConfig/apis'
import { toast } from '../../utils/toastUtil'

function LeaveTemplate() {
    const dispatch = useDispatch<AppDispatch>();
  
  const [allcompany, setAllCompany] = useState<Company[]>([])
  const [addLeaveTempData, setAddLeaveTempData] = useState({
    name: '',
    paidLeaveQuota: '',
    sickLeaveQuota: '',
    casualLeaveQuota: '',
    holidayGroupId: '',
    companyId: ''
  })
  const [allHolidaGrps, setAllHolidayGrps] = useState<HolidayGroup[]>([]);

  const companyList = useAppSelector((state) => state.companies.list);
  const user = useSelector((state: RootState) => state.auth.user);
  const holidayGroupList = useAppSelector((state) => state.holidayGroup.data);

  useEffect(() => {
    if (user && user.companyId) {
      const usersHolidayGroups = holidayGroupList.filter(holiday => holiday.companyId === user.companyId);
      setAllHolidayGrps(usersHolidayGroups);
    } else {
      setAllHolidayGrps(holidayGroupList);
    }
  }, [user, holidayGroupList])


  useEffect(() => {
    if (companyList.length > 0) {
      const activeCompany = companyList.filter(company => company.isActive);
      const loggedUsersCompany = companyList.find(
        (company) => company.id === user?.companyId
      );

      if (loggedUsersCompany) {
        setAllCompany([loggedUsersCompany]);
      } else {
        setAllCompany(activeCompany);
      }
    }

     if (user) {
          dispatch(fetchHolidayGroups({ companyId: user.companyId }));
        }

  }, [user,companyList, user?.companyId]);

  const handleAddLeaveTempSubmit = async (e:any)=>{
    e.preventDefault();
    try {
      const response = await axiosClient.post(ADD_NEW_LEAVE_TEMPLATE, addLeaveTempData);
      if(response.status===201){
        toast('Success','Leave Template added successfully','success');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">
        <div className="content flex-fill h-100">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Leave Template</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Application</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leave Template{" "}
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
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_company"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Add Leave Template
                </Link>
              </div>
              <div className="ms-2 head-icons">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h5>Leave Templates List</h5>
            </div>
            <div className="card-body p-2">
              <div className="table-responsive p-2">
                <table className="table datanew table-bordered">
                  <thead>
                    <tr>
                      <th className='py-3'>Sr. No.</th>
                      <th>Template Name</th>
                      <th>Company</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>

                  </tbody>
                </table>
              </div>
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




      {/* Add Payroll */}
      <form onSubmit={handleAddLeaveTempSubmit} >
        <div className="modal fade" id="add_company">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Leave Template</h4>
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
                    <div className="mb-3">
                      <label className="form-label">
                        Name <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        value={addLeaveTempData.name}
                        onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, name: e.target.value })}
                        className="form-control"
                        name='name'
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Paid Leaves<span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        value={addLeaveTempData.paidLeaveQuota}
                        onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, paidLeaveQuota: e.target.value })}
                        className="form-control"
                        name='name'
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Sick Leaves <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        value={addLeaveTempData.sickLeaveQuota}
                        onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, sickLeaveQuota: e.target.value })}
                        className="form-control"
                        name='name'
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Name <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        value={addLeaveTempData.casualLeaveQuota}
                        onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, casualLeaveQuota: e.target.value })}
                        className="form-control"
                        name='name'
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Select Holiday Group <span className="text-danger"> *</span>
                        </label>
                        <select
                          value={addLeaveTempData.holidayGroupId}
                          onChange={(e)=>setAddLeaveTempData({...addLeaveTempData,holidayGroupId:e.target.value})}
                          className={`form-control`}
                        >
                          <option value="">--Select Group--</option>
                          {
                            allHolidaGrps.map(holiday => (
                              <option key={holiday.id} value={holiday.id}>{holiday.groupName}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Select Company <span className="text-danger"> *</span>
                        </label>
                        <select
                          value={addLeaveTempData.companyId}
                          onChange={(e)=>setAddLeaveTempData({...addLeaveTempData,companyId:e.target.value})}
                          className={`form-control`}
                        >
                          <option value="">--Select Company--</option>
                          {
                            allcompany.map(company => (
                              <option key={company.id} value={company.id}>{company.name}</option>
                            ))
                          }
                        </select>
                      </div>
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
                  Add Payroll
                </button>
              </div>

            </div>
          </div>
        </div>
      </form>
      {/* /Add Payroll */}

    </>
  )
}

export default LeaveTemplate