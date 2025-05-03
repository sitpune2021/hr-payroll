import React, { useEffect } from 'react'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '../../../core/data/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRolePermissions } from '../../../core/data/redux/rolePermissionSlice'
import axiosClient from '../../../axiosConfig/axiosClient'

const PermissionPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedRoleIds, setSelectedRoleIds] = React.useState<number[]>([]);

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

    useEffect(() => {
        if (roles.length > 0 && selectedRoleIds.length === 0) {
            setSelectedRoleIds(roles.map((role) => role.id));
        }
    }, [roles]);

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
                        <div className="mb-3">
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-primary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Roles ({selectedRoleIds.length})
                                </button>
                                <ul className="dropdown-menu p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {roles.map((role) => (
                                        <li key={role.id}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={selectedRoleIds.includes(role.id)}
                                                    onChange={() => {
                                                        setSelectedRoleIds((prev) =>
                                                            prev.includes(role.id)
                                                                ? prev.filter((id) => id !== role.id)
                                                                : [...prev, role.id]
                                                        );
                                                    }}
                                                    id={`role-checkbox-${role.id}`}
                                                />
                                                <label className="form-check-label" htmlFor={`role-checkbox-${role.id}`}>
                                                    {role.name}
                                                </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
                                            {roles
                                                .filter((role) => selectedRoleIds.includes(role.id))
                                                .map((role) => (
                                                    <th key={role.id}>{role.name}</th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {features.map((feature) => (
                                            <tr key={feature.id}>
                                                <th>{feature.name}</th>
                                                {roles
                                                    .filter((role) => selectedRoleIds.includes(role.id))
                                                    .map((role) => (
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
