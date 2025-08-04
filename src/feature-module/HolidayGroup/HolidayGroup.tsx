import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../router/all_routes';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '../../core/data/redux/hooks';
import { RootState, AppDispatch } from '../../core/data/redux/store';
import axiosClient from '../../axiosConfig/axiosClient';
import { toast } from '../../utils/toastUtil';
import { Company } from '../../core/data/redux/companySlice';
import { fetchHolidayGroups, HolidayGroup } from '../../core/data/redux/holidayGroupSlice';
import {
  ADD_HOLIDAY_GROUP_NEW,
  ADD_NEW_HOLIDAY,
  DELETE_HOLIDAY,
  FETCH_HOLIDAY_BY_GROUPiD,
} from '../../axiosConfig/apis';

function HolidayGroups() {
  const dispatch = useDispatch<AppDispatch>();

  const [allCompany, setAllCompany] = useState<Company[]>([]);
  const [addGroupData, setAddGroupData] = useState({ groupName: '', companyId: '' });
  const [addHolidayData, setAddHolidayData] = useState({
    holidayGroupId: '',
    name: '',
    holidayDate: '',
  });

  const [holidays, setHolidays] = useState<{ [groupId: number]: any[] }>({});
  const [expandedGroups, setExpandedGroups] = useState<{ [groupId: number]: boolean }>({});
  const [loadingGroups, setLoadingGroups] = useState<{ [groupId: number]: boolean }>({});
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
      const activeCompany = companyList.filter((c) => c.isActive);
      const userCompany = companyList.find((c) => c.id === user?.companyId);
      setAllCompany(userCompany ? [userCompany] : activeCompany);
    }

    if (user) {
      dispatch(fetchHolidayGroups({ companyId: user.companyId }));
    }
  }, [user, companyList, user?.companyId]);

  const toggleGroup = async (groupId: number) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));

    // Only fetch if not already loaded
    if (!holidays[groupId]) {
      setLoadingGroups((prev) => ({ ...prev, [groupId]: true }));
      try {
        const res = await axiosClient.get(`${FETCH_HOLIDAY_BY_GROUPiD}${groupId}`);
        setHolidays((prev) => ({ ...prev, [groupId]: res.data }));
      } catch (err) {
        toast('error', 'Failed to load holidays');
      } finally {
        setLoadingGroups((prev) => ({ ...prev, [groupId]: false }));
      }
    }
  };

  const saveNewGroup = async (e: any) => {
    e.preventDefault();
    if (!addGroupData.groupName.trim() || !addGroupData.companyId) {
      toast('error', 'Please fill all fields');
      return;
    }

    try {
      await axiosClient.post(ADD_HOLIDAY_GROUP_NEW, addGroupData);
      if (user) dispatch(fetchHolidayGroups({ companyId: user.companyId }));
      setAddGroupData({ groupName: '', companyId: '' });
      toast('success', 'Holiday Group added');
    } catch (err) {
      toast('error', 'Error creating holiday group');
    }
  };

  const handleAddHoliday = async (e: any) => {
    e.preventDefault();
    const groupId = Number(addHolidayData.holidayGroupId);
    try {
      await axiosClient.post(ADD_NEW_HOLIDAY, addHolidayData);
      toast('success', 'Holiday added');
      // Refresh holidays
      const res = await axiosClient.get(`${FETCH_HOLIDAY_BY_GROUPiD}${groupId}`);
      setHolidays((prev) => ({ ...prev, [groupId]: res.data }));
      setAddHolidayData({ holidayGroupId: '', name: '', holidayDate: '' });
    } catch (err) {
      toast('error', 'Error adding holiday');
    }
  };

  const handleDeleteHoliday = async (holidayId: number, groupId: number) => {
    try {
      const response = await axiosClient.delete(`${DELETE_HOLIDAY}${holidayId}`);
      if (response.status === 200) {
        toast('success', 'Deleted successfully');
        const res = await axiosClient.get(`${FETCH_HOLIDAY_BY_GROUPiD}${groupId}`);
        setHolidays((prev) => ({ ...prev, [groupId]: res.data }));
      }

    } catch (err) {
      toast('error', 'Could not delete holiday');
    }
  };

  return (
    <>
      <div className="page-wrapper vh-100 d-flex flex-column justify-content-between">
        <div className="content flex-fill h-100">
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Holiday Groups</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={all_routes.adminDashboard}>
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Holiday Management
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#add_group_modal"
              >
                <i className="ti ti-circle-plus me-2" />
                Add Holiday Group
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5>Holiday Group List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Group Name</th>
                      <th>Company</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allHolidaGrps.map((group, i) => (
                      <React.Fragment key={group.id}>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{group.groupName}</td>
                          <td>{group.companyId}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => toggleGroup(group.id)}
                            >
                              {expandedGroups[group.id] ? 'Hide' : 'Show'} Holidays
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() =>
                                setAddHolidayData((prev) => ({
                                  ...prev,
                                  holidayGroupId: String(group.id),
                                }))
                              }

                              data-bs-toggle="modal"
                              data-bs-target="#add_holiday_modal"
                            >
                              Add Holiday
                            </button>
                          </td>
                        </tr>

                        {/* Expanded holidays */}
                        {expandedGroups[group.id] && (
                          <>
                            {loadingGroups[group.id] ? (
                              <tr>
                                <td colSpan={4} className="text-center">
                                  <span className="spinner-border spinner-border-sm me-2" />
                                  Loading holidays...
                                </td>
                              </tr>
                            ) : holidays[group.id]?.length ? (
                              holidays[group.id].map((h) => (
                                <tr key={`h-${h.id}`} className="bg-light">
                                  <td></td>
                                  <td colSpan={2}>
                                    <strong>  {h.name} – {h.holidayDate}{' '}</strong>
                                  </td>
                                  <td>
                                    <i
                                      className="ti ti-trash text-danger cursor-pointer"
                                      onClick={() => handleDeleteHoliday(h.id, group.id)}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center text-muted">
                                  No holidays found
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Group */}
      <form onSubmit={saveNewGroup}>
        <div className="modal fade" id="add_group_modal">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Holiday Group</h5>
                <button className="btn-close" data-bs-dismiss="modal" />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Group Name"
                  value={addGroupData.groupName}
                  onChange={(e) => setAddGroupData({ ...addGroupData, groupName: e.target.value })}
                />
                <select
                  className="form-control"
                  value={addGroupData.companyId}
                  onChange={(e) => setAddGroupData({ ...addGroupData, companyId: e.target.value })}
                >
                  <option value="">-- Select Company --</option>
                  {allCompany.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal: Add Holiday */}
      <form onSubmit={handleAddHoliday}>
        <div className="modal fade" id="add_holiday_modal">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Holiday</h5>
                <button className="btn-close" data-bs-dismiss="modal" />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Holiday Name"
                  value={addHolidayData.name}
                  onChange={(e) =>
                    setAddHolidayData({ ...addHolidayData, name: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={addHolidayData.holidayDate}
                  onChange={(e) =>
                    setAddHolidayData({ ...addHolidayData, holidayDate: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default HolidayGroups;
