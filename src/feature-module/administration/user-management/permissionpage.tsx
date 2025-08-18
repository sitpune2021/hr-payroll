import React, { useEffect, useState } from 'react'
import { all_routes } from '../../router/all_routes'
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '../../../core/data/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRolePermissions } from '../../../core/data/redux/rolePermissionSlice'
import axiosClient from '../../../axiosConfig/axiosClient'
import { useAppSelector } from '../../../core/data/redux/hooks'
import { Company } from '../../../core/data/redux/companySlice'

const PermissionPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | ''>('');
    const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
    const [allcompany, setAllCompany] = useState<Company[]>([]);

    const roles = useSelector((state: RootState) => state.roles.list);
    const features = useSelector((state: RootState) => state.feature.allFeatures);
    const allowedFeatures = useSelector((state: RootState) => state.feature.allowedFeatures);
    const rolePermissions = useSelector((state: RootState) => state.rolePermission.list);
    const companyList = useAppSelector((state) => state.companies.list);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        dispatch(fetchRolePermissions());
    }, [dispatch]);

    const isChecked = (roleId: number, permissionId: number) => {
        return rolePermissions.some(
            (rp) => rp.roleId === roleId && rp.permissionId === permissionId
        );
    };

    const handlePermissionToggle = async (roleId: number, permissionId: number) => {
        const response = await axiosClient.post(`/api/settings/roles/${roleId}/permissions/${permissionId}/toggle`);
        if (response.status === 200) {
            dispatch(fetchRolePermissions());
        }
    };

    useEffect(() => {
        if (selectedCompanyId) {
            const companySpecificRoles = roles.filter(
                (role) =>
                    role.companyId === selectedCompanyId &&
                    role.name !== user?.role // Exclude current user's role
            );
            setFilteredRoles(companySpecificRoles);

            setSelectedRoleIds((prevSelected) =>
                companySpecificRoles
                    .filter((role) => prevSelected.includes(role.id))
                    .map((role) => role.id)
            );
        } else {
            setFilteredRoles([]);
            setSelectedRoleIds([]);
        }
    }, [selectedCompanyId, roles, user]);

    useEffect(() => {
        if (selectedCompanyId && roles.length > 0 && selectedRoleIds.length === 0) {
            const companyRolesExcludingUser = roles.filter(
                (role) =>
                    role.companyId === selectedCompanyId &&
                    role.name !== user?.role
            );
            setSelectedRoleIds(companyRolesExcludingUser.map((role) => role.id));
        }
    }, [roles, selectedCompanyId, user]);

    useEffect(() => {
        if (companyList.length > 0) {
            const loggedUsersCompany = companyList.find(
                (company) => company.id === user?.companyId
            );
            if (loggedUsersCompany) {
                setAllCompany([loggedUsersCompany]);
            } else {
                setAllCompany(companyList);
            }
        }
    }, []);

    useEffect(() => {
        if (user && user.companyId) {
            const usersCompany = companyList.find(company => company.id === user.companyId);
            if (usersCompany) {
                setSelectedCompanyId(usersCompany.id);
            }
        }
    }, [user, companyList]);

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
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
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Select Company</label>
                            <div style={{ position: "relative", width: "100%" }}>
                                <select
                                    className="form-control"
                                    value={selectedCompanyId}
                                    onChange={(e) => setSelectedCompanyId(Number(e.target.value))}
                                    style={{
                                        appearance: "none",
                                        WebkitAppearance: "none",
                                        MozAppearance: "none",
                                        paddingRight: "2rem",
                                    }}
                                >
                                    <option value="">Select</option>
                                    {allcompany.map((company) => (
                                        <option value={company.id} key={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                <i
                                    className="bi bi-chevron-down"
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        pointerEvents: "none",
                                        fontSize: "1rem",
                                        color: "#555",
                                    }}
                                ></i>
                            </div>
                        </div>

                        {selectedCompanyId ? (
                            <div className="mb-3" style={{ border: '1px solid red' }}>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-outline-primary dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Roles ({filteredRoles.length})
                                    </button>
                                    <ul className="dropdown-menu p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {filteredRoles.map((role) => (
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
                        ) : (
                            <div className="mb-3 text-danger fw-bold">
                                Please select a company first to view and assign roles.
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="card-body p-0">
                            <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
                                <table className="table">
                                    <thead className="thead-light" style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fff" }}>
                                        <tr>
                                            <th>Features\Roles</th>
                                            {selectedCompanyId ?
                                                filteredRoles
                                                    .filter((role) => selectedRoleIds.includes(role.id))
                                                    .map((role) => (
                                                        <th key={role.id}>{role.name}</th>
                                                    )) : <th colSpan={4}>Select Company</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCompanyId ?
                                            allowedFeatures.map((feature) => (
                                                <tr key={feature.id}>
                                                    <th>{feature.name}</th>
                                                    {filteredRoles
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
                                            )) : null}
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

export default PermissionPage;
