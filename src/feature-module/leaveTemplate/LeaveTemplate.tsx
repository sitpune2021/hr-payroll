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
import axiosClient, { baseURL } from '../../axiosConfig/axiosClient'
import { ADD_NEW_LEAVE_TEMPLATE, EDIT_LEAVE_TEMPLATE_WITH_COMPONENTS, FETCH_WEEKLY_OFF_COMPO_BY_TEMP_ID } from '../../axiosConfig/apis'
import { toast } from '../../utils/toastUtil'
import { fetchLeaveTemplates, LeaveTemplates } from '../../core/data/redux/leaveTemplateSlice'

function LeaveTemplate() {
  const dispatch = useDispatch<AppDispatch>();

  interface LeaveTempComponent {
    id?: number;
    dayOfWeek: number;
    leaveTemplateId?: number;
    isFixed: boolean;
    isAlternate: boolean;
    weekNumbers: string;
    isActive: boolean;
  }

  interface LeaveTemplateUpdatePayload {
    name: string;
    companyId: number | string;
    paidLeaveQuota: number | string;
    sickLeaveQuota: number | string;
    casualLeaveQuota: number | string;
    holidayGroupId: number | string;
    weeklyOffs: LeaveTempComponent[];
  }

  const [allcompany, setAllCompany] = useState<Company[]>([])
  const [weeklyOffComponents, setWeeklyOffComponents] = useState<LeaveTempComponent[]>([])
  const [editingTemplate, setEditingTemplate] = useState<LeaveTemplates | null>(null);
  const [addLeaveTempData, setAddLeaveTempData] = useState({
    name: '',
    paidLeaveQuota: '',
    sickLeaveQuota: '',
    casualLeaveQuota: '',
    allowedLateEntries: '',
    holidayGroupId: '',
    companyId: ''
  })
  const [allHolidaGrps, setAllHolidayGrps] = useState<HolidayGroup[]>([]);
  const [allLeaveTemplates, setAllLeaveTemplates] = useState<LeaveTemplates[]>([]);

  const companyList = useAppSelector((state) => state.companies.list);
  const user = useSelector((state: RootState) => state.auth.user);
  const holidayGroupList = useAppSelector((state) => state.holidayGroup.data);
  const leaveTemplateList = useAppSelector((state) => state.leaveTemplate.templates);

  useEffect(() => {
    if (editingTemplate) fetchWeeklyOffComponents(editingTemplate.id)
  }, [editingTemplate])

  useEffect(() => {
    if (user && user.companyId) {
      const usersHolidayGroups = holidayGroupList.filter(holiday => holiday.companyId === user.companyId);
      setAllHolidayGrps(usersHolidayGroups);
    } else {
      setAllHolidayGrps(holidayGroupList);
    }

    if (user && user.companyId) {
      const userLeaveTemplates = leaveTemplateList.filter(leaveTemp => leaveTemp.companyId === user.companyId);
      setAllLeaveTemplates(userLeaveTemplates);
    } else {
      setAllLeaveTemplates(leaveTemplateList);
    }

  }, [user, holidayGroupList, leaveTemplateList, dispatch])


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
      dispatch(fetchLeaveTemplates({ companyId: user.companyId }));
      dispatch(fetchHolidayGroups({ companyId: user.companyId }));
    }

  }, [user, companyList, user?.companyId, dispatch]);

  const fetchWeeklyOffComponents = async (templateId: number) => {
    const response = await axiosClient.get(`${FETCH_WEEKLY_OFF_COMPO_BY_TEMP_ID}${templateId}`);
    if (response.status === 200) {
      setWeeklyOffComponents(response.data);
    }
  }

  const handleAddLeaveTempSubmit = async (e: any) => {
    e.preventDefault();
    try {
      Object.keys(addLeaveTempData).forEach((key) => {
        if (!key.trim()) {
          toast('Error', 'Please fill all the fields', 'danger');
          return;
        }

      })
      const response = await axiosClient.post(ADD_NEW_LEAVE_TEMPLATE, addLeaveTempData);
      if (response.status === 201) {
        toast('Success', 'Leave Template added successfully', 'success');
        if (user?.companyId) {
          dispatch(fetchLeaveTemplates({ companyId: user.companyId }));
        }

        // Optional: Reset form or close modal
        setAddLeaveTempData({
          name: '',
          paidLeaveQuota: '',
          sickLeaveQuota: '',
          casualLeaveQuota: '',
          allowedLateEntries: '',
          holidayGroupId: '',
          companyId: '',
        });
      }
    } catch (error) {
    console.log(error);
  }
}

const updateLeaveTemplateWithComponents = async (
  templateId: number,
  payload: LeaveTemplateUpdatePayload
) => {
  try {
    const response = await axiosClient.put(`${EDIT_LEAVE_TEMPLATE_WITH_COMPONENTS}${templateId}`, payload);
    if (response.status === 200) {
      toast('Success', response.data.message, 'success')

      dispatch(fetchLeaveTemplates({ companyId: user?.companyId }));
      setEditingTemplate(null);
    }
  } catch (error) {
    console.log("@@@@@@@@@@@@@@", error);
    console.error('Failed to update leave template:', error);
    throw error;
  }
};

const handleSaveEdit = async (e: any) => {
  e.preventDefault()
  if (!editingTemplate) return;

  try {
    const payload = {
      ...editingTemplate,
      companyId: Number(editingTemplate.companyId),
      paidLeaveQuota: Number(editingTemplate.paidLeaveQuota),
      sickLeaveQuota: Number(editingTemplate.sickLeaveQuota),
      casualLeaveQuota: Number(editingTemplate.casualLeaveQuota),
      holidayGroupId: Number(editingTemplate.holidayGroupId),
      weeklyOffs: weeklyOffComponents,
    };

    const respo = await updateLeaveTemplateWithComponents(editingTemplate.id, payload);

  } catch (error) {
    console.log("@@@@@@@@@@@@@@@@", error);

    alert('Failed to update template');
  }
};


const getCompanyNameById = (companyId: number | null | undefined): string => {
  const company = companyList.find((comp) => comp.id === companyId);
  return company ? company.name : 'Unknown Company';
};

const handleChange = (index: number, field: keyof LeaveTempComponent, value: any) => {
  const updated = [...weeklyOffComponents];
  let updatedComp = { ...updated[index], [field]: value };

  // Enforce rule: if isFixed is true, isAlternate must be false
  if (field === 'isFixed' && value === true) {
    updatedComp.isAlternate = false;
  }

  // Optional: if isAlternate is true, isFixed must be false
  if (field === 'isAlternate' && value === true) {
    updatedComp.isFixed = false;
  }

  updated[index] = updatedComp;
  setWeeklyOffComponents(updated);
};


const addComponent = () => {
  setWeeklyOffComponents([
    ...weeklyOffComponents,
    {
      dayOfWeek: 0,
      isFixed: false,
      isAlternate: false,
      weekNumbers: '',
      isActive: true,
    },
  ]);
};


const removeComponent = (index: number) => {
  const updated = [...weeklyOffComponents];
  updated.splice(index, 1);
  setWeeklyOffComponents(updated);
};

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
                    <th className='py-3'>#</th>
                    <th>Template Name</th>
                    <th>Company</th>
                    <th>Hoilday Group</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    allLeaveTemplates.map((leaveTemplate, index) => (
                      <tr key={leaveTemplate.id}>
                        <td>{index + 1}</td>
                        <td>{leaveTemplate.name}</td>
                        <td>{leaveTemplate.companyId}</td>
                        <td>{leaveTemplate.holidayGroupId}</td>
                        <td>
                          <div className="action-icon d-inline-flex">
                            {/* <Link to="#" className="me-2" data-bs-toggle="modal" data-bs-target="#company_detail">
                              <i className="ti ti-eye" />
                            </Link> */}
                            <Link to="#" className="me-2" onClick={() => setEditingTemplate(leaveTemplate)} data-bs-toggle="modal" data-bs-target="#edit_branch">
                              <i className="ti ti-edit" />
                            </Link>
                            <Link to="#" data-bs-toggle="modal" data-bs-target="#delete_modal">
                              <i className="ti ti-trash" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
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




    {/* Add Leave template */}
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
                      type="number"
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
                      type="number"
                      value={addLeaveTempData.sickLeaveQuota}
                      onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, sickLeaveQuota: e.target.value })}
                      className="form-control"
                      name='name'
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Casual Leaves <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      value={addLeaveTempData.casualLeaveQuota}
                      onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, casualLeaveQuota: e.target.value })}
                      className="form-control"
                      name='name'
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Allowed Late come/Early leave (per month) <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      value={addLeaveTempData.allowedLateEntries}
                      onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, allowedLateEntries: e.target.value })}
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
                        onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, holidayGroupId: e.target.value })}
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
                        onChange={(e) => setAddLeaveTempData({ ...addLeaveTempData, companyId: e.target.value })}
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
    {/* /Add leave template */}


    {/* Edit leave template */}
    <div className="modal fade" id="edit_branch">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Edit Leave Template <strong>-------{getCompanyNameById(editingTemplate?.companyId)}</strong></h4>
            <button
              type="button"
              className="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSaveEdit}>
            <div className="modal-body pb-0">
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">
                      Template Name <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name='name'
                      value={editingTemplate?.name}
                      className="form-control"
                      defaultValue="Stellar Dynamics"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Paid Leaves</label>
                    <input
                      className="form-control"
                      value={editingTemplate?.paidLeaveQuota}
                      defaultValue="sophie@example.com"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Sick Leaves</label>
                    <input
                      className="form-control"
                      value={editingTemplate?.sickLeaveQuota}
                      defaultValue="sophie@example.com"
                    />
                  </div>
                </div><div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Casual Leaves</label>
                    <input
                      className="form-control"
                      value={editingTemplate?.casualLeaveQuota}
                      defaultValue="sophie@example.com"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Allowed Late entry(Monthly)</label>
                    <input
                      className="form-control"
                      value={editingTemplate?.allowedLateEntries}
                      defaultValue="sophie@example.com"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">
                      Select Holiday Group <span className="text-danger"> *</span>
                    </label>
                    <select
                      value={editingTemplate?.holidayGroupId}
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
                  <h6>Weekly Off Components</h6>
                  {weeklyOffComponents.map((comp, idx) => (
                    <div className="row align-items-end mb-2" key={idx}>
                      <div className="col-md-2">
                        <label>Day of Week</label>
                        <select
                          className="form-select"
                          value={comp.dayOfWeek}
                          onChange={(e) => handleChange(idx, 'dayOfWeek', Number(e.target.value))}
                        >
                          <option value={0}>Sunday</option>
                          <option value={1}>Monday</option>
                          <option value={2}>Tuesday</option>
                          <option value={3}>Wednesday</option>
                          <option value={4}>Thursday</option>
                          <option value={5}>Friday</option>
                          <option value={6}>Saturday</option>
                        </select>
                      </div>

                      <div className="col-md-1">
                        <label>Fixed</label>
                        <input
                          type="checkbox"
                          className="form-check-input mt-2"
                          checked={comp.isFixed}
                          onChange={(e) => handleChange(idx, 'isFixed', e.target.checked)}
                        />
                      </div>

                      <div className="col-md-1">
                        <label>Alternate</label>
                        <input
                          type="checkbox"
                          className="form-check-input mt-2"
                          checked={comp.isAlternate}
                          onChange={(e) => handleChange(idx, 'isAlternate', e.target.checked)}
                        />
                      </div>

                      <div className="col-md-3">
                        <label>Week Type</label>
                        <select
                          className="form-select"
                          disabled={!comp.isAlternate}
                          value={comp.weekNumbers}
                          onChange={(e) => handleChange(idx, 'weekNumbers', e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="1,3,5">Odd Weeks(1,3,5)</option>
                          <option value="2,4,6">Even Weeks(2,4,6)</option>
                        </select>
                      </div>


                      <div className="col-md-2">
                        <label>Active</label>
                        <select
                          className="form-select"
                          value={comp.isActive ? 'true' : 'false'}
                          onChange={(e) => handleChange(idx, 'isActive', e.target.value === 'true')}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>

                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeComponent(idx)}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-link" onClick={addComponent}>
                    + Add Weekly Off
                  </button>
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
    {/* /Edit Leave template */}


    {/* Leave template  Detail */}
    <div className="modal fade" id="company_detail">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Leave Template Detail</h4>
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
                  <div>
                    <p className="text-gray-9 fw-medium mb-0">
                      my name is khan
                    </p>
                    <p>no mail</p>
                  </div>
                </div>
                <span className="badge badge-success">
                  <i className="ti ti-point-filled" />
                  Active
                </span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-gray-9 fw-medium">Basic Info</p>
              <div className="pb-1 border-bottom mb-4">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p className="fs-12 mb-0">Phone Number</p>
                      <p className="text-gray-9">only whatsapp</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p className="fs-12 mb-0">Created Date</p>
                      <p className="text-gray-9">24 yrs ago</p>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p className="fs-12 mb-0">Address</p>
                      <p className="text-gray-9">Pune</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p className="fs-12 mb-0">Company Name</p>
                      <p className="text-gray-9">
                        ####company name
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
    {/* /Leave template  Detail */}
  </>
)
}

export default LeaveTemplate