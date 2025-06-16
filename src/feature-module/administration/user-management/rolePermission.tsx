import React, { useEffect, useState } from 'react'
import { status } from '../../../core/common/selectoption/selectoption'
import CommonSelect from '../../../core/common/commonSelect'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import { fetchRoles, Role } from '../../../core/data/redux/rolesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../core/data/redux/store'
import { toast } from '../../../utils/toastUtil'
import axiosClient from '../../../axiosConfig/axiosClient'
import { ADD_NEW_ROLES } from '../../../axiosConfig/apis'
import { useAppSelector } from '../../../core/data/redux/hooks'
import { Company } from '../../../core/data/redux/companySlice'
import { m } from 'react-router/dist/development/fog-of-war-Cm1iXIp7'

const RolesPermission = () => {

    const dispatch = useDispatch<AppDispatch>();


    const [name, setName] = useState('')
    const [companySelectedAddRole, setCompanySelectedAddRole] = useState<number | ''>('');
    const [allcompany, setAllCompany] = useState<Company[]>([])
    const roles = useSelector((state: RootState) => state.roles.list)
    const companyList = useAppSelector((state) => state.companies.list);
    const user = useSelector((state: RootState) => state.auth.user);



    const handleAddRoleSubmit = async (e: any) => {
        e.preventDefault();
        if (!name) {
            toast('Info', 'Name is required.', 'danger')
            return;
        }
          if (!companySelectedAddRole) {
            toast('Info', 'Company selection is required.', 'danger')
            return;
        }
        try {
            const response = await axiosClient.post(ADD_NEW_ROLES, { name,companyId:companySelectedAddRole })
            if (response.status === 201) {
                toast('Success', 'Role added Successfully', 'success')
                await dispatch(fetchRoles());
            }
        } catch (error) {
            toast('Info', "Error while adding Role", 'danger')
        }
    }

    const getCompanyNameById = (companyId: number | null | undefined): string => {
        const company = companyList.find((comp) => comp.id === companyId);
        return company ? company.name : 'Unknown Company';
    };
    useEffect(() => {
        if (companyList.length > 0 && user) {
            const usersCompany = companyList.find(company => company.id === user.companyId);

            if (usersCompany) {
                setAllCompany([usersCompany]);
                setCompanySelectedAddRole(usersCompany.id);
            } else {
                setAllCompany(companyList);
            }
        }
    }, [user, companyList]);

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                        <div className="my-auto mb-2">
                            <h2 className="mb-1">Roles</h2>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">Administration</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Roles
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
                                    data-bs-toggle="modal" data-inert={true}
                                    data-bs-target="#add_role"
                                    className="btn btn-primary d-flex align-items-center"
                                >
                                    <i className="ti ti-circle-plus me-2" />
                                    Add New Roles
                                </Link>
                            </div>
                            <div className="head-icons ms-2">
                                <CollapseHeader />
                            </div>
                        </div>
                    </div>
                    {/* /Breadcrumb */}
                    {/* Assets Lists */}
                    <div className="card">
                        <div className="card-body p-0">
                            <div className="table-responsive p-2" style={{ height: '400px' }}>
                                <table className="table datanew table-bordered">
                                    <thead>
                                        <tr>
                                            <th className='py-3'>Id</th>
                                            <th className='py-3'>Role</th>
                                            <th className='py-3'>Company</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            roles.map(role => (
                                                <tr key={role.id}>
                                                    <td>{role.id}</td>
                                                    <td>{role.name}</td>
                                                    <td>{getCompanyNameById(role.companyId)}</td>
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
            {/* Add Assets */}
            <div className="modal fade" id="add_role">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add Role</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={(e) => handleAddRoleSubmit(e)}>
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Role Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Select Company</label>
                                        <select
                                            className="form-control"
                                            value={companySelectedAddRole}
                                            onChange={(e) => setCompanySelectedAddRole(Number(e.target.value))}
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
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-light me-2"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button type="submit" data-bs-dismiss="modal" className="btn btn-primary">
                                    Add Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Add Assets */}
            {/* Edit Role */}
            <div className="modal fade" id="edit_role">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Role</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form action="roles-permissions.html">
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Role Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                defaultValue="Office Furnitures"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3 ">
                                            <label className="form-label">Status</label>
                                            <CommonSelect
                                                className='select'
                                                options={status}
                                                defaultValue={status[1]}
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
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Edit Role */}
        </>

    )
}

export default RolesPermission
