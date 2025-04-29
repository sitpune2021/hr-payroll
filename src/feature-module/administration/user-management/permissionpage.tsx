import React, { useEffect } from 'react'
import { status } from '../../../core/common/selectoption/selectoption'
import CommonSelect from '../../../core/common/commonSelect'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import PredefinedDateRanges from '../../../core/common/datePicker'
import Table from "../../../core/common/dataTable/index";
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { rolesDetails } from '../../../core/data/json/rolesDetails'
import CollapseHeader from '../../../core/common/collapse-header/collapse-header'
import { AppDispatch, RootState } from '../../../core/data/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRolePermissions } from '../../../core/data/redux/rolePermissionSlice'
import axiosClient from '../../../axiosConfig/axiosClient'

const PermissionPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchRolePermissions());
    }, [dispatch])


    const roles = useSelector((state: RootState) => state.roles.list)
    const features = useSelector((state: RootState) => state.feature.allFeatures)
    const rolePermissions = useSelector((state: RootState) => state.rolePermission.list)

    const isChecked = (roleId: number, permissionId: number) => {
        return rolePermissions.some(
            (rp) => rp.roleId === roleId && rp.permissionId === permissionId
        );
    };

    const handlePermissionToggle = async (roleId: number, permissionId: number) => {
        const response = await axiosClient.post(`/api/settings/roles/${roleId}/permissions/${permissionId}/toggle`)
        if (response.status === 200) {
            dispatch(fetchRolePermissions());
        }
    }



    const data = rolesDetails;
    const columns = [
        {
            title: "Role",
            dataIndex: "role",
            sorter: (a: any, b: any) => a.role.length - b.role.length,
        },
        {
            title: "Created Date",
            dataIndex: "created_date",
            sorter: (a: any, b: any) => a.created_date.length - b.created_date.length,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text: string, record: any) => (
                <>
                    <span
                        className={`badge d-inline-flex align-items-center badge-xs ${text === 'Active'
                            ? 'badge-success'
                            : 'badge-danger'
                            }`}
                    >
                        <i className="ti ti-point-filled me-1"></i>
                        {text}
                    </span>
                </>
            ),
            sorter: (a: any, b: any) => a.status.length - b.status.length,
        },
        {
            title: "",
            dataIndex: "actions",
            render: () => (
                <div className="action-icon d-inline-flex">
                    <Link to={"permission.html"} className="me-2">
                        <i className="ti ti-shield" />
                    </Link>
                    <Link
                        to="#"
                        className="me-2"
                        data-bs-toggle="modal" data-inert={true}
                        data-bs-target="#edit_role"
                    >
                        <i className="ti ti-edit" />
                    </Link>
                    <Link to="#" data-bs-toggle="modal" data-inert={true} data-bs-target="#delete_modal">
                        <i className="ti ti-trash" />
                    </Link>
                </div>



            ),
        },
    ]

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    {/* Breadcrumb */}
                    <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                        <div className="my-auto mb-2">
                            <h2 className="mb-1">Permissions</h2>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">Administration</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Permissions
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    {/* /Breadcrumb */}
                    {/* Assets Lists */}
                    <div className="card">
                        <div className="card-body p-0">

                            <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
                                <table className="table">
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fff" }}>
                                        <tr>
                                            <th>Features\Roles</th>
                                            {roles.map(role => (
                                                <th key={role.id}>{role.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {features.map((feature) => (
                                            <tr key={feature.id}>
                                                <th>{feature.name}</th>
                                                {roles.map((role) => (
                                                    <td key={role.id}>
                                                        <div className="form-check form-check-md">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={isChecked(role.id, feature.id)}
                                                                onChange={() => handlePermissionToggle(role.id, feature.id)}
                                                            />
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
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
        </>


    )
}
export default PermissionPage
