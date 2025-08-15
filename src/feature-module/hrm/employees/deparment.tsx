import React, { useEffect, useState } from 'react'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import CommonSelect from '../../../core/common/commonSelect';
import CollapseHeader from '../../../core/common/collapse-header/collapse-header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/data/redux/store';
import { useAppSelector } from '../../../core/data/redux/hooks';
import { Company } from '../../../core/data/redux/companySlice';
import axiosClient from '../../../axiosConfig/axiosClient';
import { ADD_NEW_DEPARTMENTS } from '../../../axiosConfig/apis';
import { toast } from '../../../utils/toastUtil';
type PasswordField = "password" | "confirmPassword";

const Department = () => {

  interface Department1 {
    id: number;
    name: string;
    description: string;
    companyId: number;
    isActive: boolean;
  }

  const [allDept, setAllDept] = useState<Department1[]>([])
  const [addDeptData, setAddDeptData] = useState({
    "name": "",
    "description": "",
    "companyId": ""
  })
  const [allcompany, setAllCompany] = useState<Company[]>([])
  const companyList = useAppSelector((state) => state.companies.list);
  const departmentList = useSelector((state: RootState) => state.departments.data)
  const user = useSelector((state: RootState) => state.auth.user);



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

    if (user?.companyId) {
      setAllDept(departmentList.filter(dept => dept.companyId === user?.companyId));
    }
  }, [user, companyList]);

  const handleAddDeptSubmit = async (e: any) => {
    e.preventDefault();

    const response = await axiosClient.post(ADD_NEW_DEPARTMENTS, addDeptData);
    if (response.status === 201) {
      toast('Success', 'Department Added Successfully', 'success')
    }

    setAddDeptData({
      "name": "",
      "description": "",
      "companyId": ""
    })

    console.log(addDeptData);

  }
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Departments</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Employee</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Departments
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal" data-inert={true}
                  data-bs-target="#add_department"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Add Department
                </Link>
              </div>
              <div className="head-icons ms-2">
                <CollapseHeader />
              </div>
            </div>
          </div>
          {/* /Breadcrumb */}
          {/* Performance Indicator list */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h5>Department List</h5>
            </div>
            <div className="card-body p-0">
              {/* <Table dataSource={data} columns={columns} Selection={true} /> */}

              <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
                <table className="table">
                  <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fff" }}>
                    <tr>
                      <th>Sr.No</th>
                      <th>Department Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      allDept.map((department, index) => (
                        <tr key={department.id}>
                          <td>{index + 1}</td>
                          <td>{department.name}</td>
                          <td>{department.description}</td>
                          <td>{department.isActive ? 'Active' : 'Inactive'}</td>
                          <td>
                            <div className="action-icon d-inline-flex">
                              <Link
                                to="#"
                                className="me-2"
                                data-bs-toggle="modal" data-inert={true}
                                data-bs-target="#edit_department"
                              >
                                <i className="ti ti-edit" />
                              </Link>
                              <Link
                                to="#"
                                data-bs-toggle="modal" data-inert={true}
                                data-bs-target="#delete_modal"
                              >
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
          {/* /Performance Indicator list */}
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
      {/* Add Department */}
      <div className="modal fade" id="add_department">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Department</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleAddDeptSubmit}>
              <div className="modal-body pb-0">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Department Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addDeptData.name}
                        onChange={(e) => setAddDeptData({ ...addDeptData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Department Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addDeptData.description}
                        onChange={(e) => setAddDeptData({ ...addDeptData, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Select Company Name</label>
                      <select className="form-control"
                        value={addDeptData.companyId}
                        onChange={(e) => setAddDeptData({ ...addDeptData, companyId: e.target.value })}
                      >
                        <option value="">Select</option>
                        {
                          allcompany.map(company => (
                            <option value={company.id} key={company.id}>{company.name}</option>
                          ))
                        }
                      </select>
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
                <button type="submit" data-bs-dismiss="modal" className="btn btn-primary">
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Department */}
      {/* Edit Department */}
      <div className="modal fade" id="edit_department">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Department</h4>
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
                      <label className="form-label">Department Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Finance"
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
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Department */}
    </>


  )
}

export default Department
