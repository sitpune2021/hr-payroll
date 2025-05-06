import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { all_routes } from '../router/all_routes';
import CollapseHeader from '../../core/common/collapse-header/collapse-header';
import PredefinedDateRanges from '../../core/common/datePicker';
import { useSelector } from 'react-redux';
import { RootState } from '../../core/data/redux/store';
import { Branch } from '../../core/data/redux/branchesSlice';
import { fetchShifts, Shift } from '../../core/data/redux/shiftSlice';
import { toast } from '../../utils/toastUtil';
import axiosClient from '../../axiosConfig/axiosClient';
import { ADD_NEW_SHIFT, EDIT_SHIFT } from '../../axiosConfig/apis';
import { useAppDispatch } from '../../core/data/redux/hooks';

function ShiftsManagement() {

    const dispatch = useAppDispatch();


    const [allBranches, setAllBranches] = useState<Branch[]>([])
    const [tableShifts, setTableShifts] = useState<Shift[]>([]);
    const [editSHiftData, setEditShiftData] = useState<Shift | null>(null);
    const userAllowedLabels = useSelector((state: RootState) => state.feature.allowedFeatures);
    const filteredLabels = userAllowedLabels.map((feature: any) => feature.name);
    const allShifts = useSelector((state: RootState) => state.shifts.shifts);
    const user = useSelector((state: RootState) => state.auth.user);
    const branchList: Branch[] = useSelector((state: RootState) => state.branches.branches);


    const geBranchNameById = (branchId: number | null | undefined): string => {
        const brnch = branchList.find((branch) => branch.id === branchId);
        return brnch ? brnch.name : 'Unknown Branch';
    };


    useEffect(() => {
        if (branchList.length > 0) {
            const loggedUsersBranches = branchList.filter(
                (branch) => branch.companyId === user?.companyId
            );

            if (loggedUsersBranches.length > 0) {
                setAllBranches(loggedUsersBranches);
            } else {
                setAllBranches(branchList);
            }
        }
        if (allShifts.length > 0) {
            const loggedUserShifts = allShifts.filter(
                (shift) => shift.branchId === user?.companyId
            );

            if (loggedUserShifts.length > 0) {
                setTableShifts(loggedUserShifts);
            } else {
                setTableShifts(allShifts);
            }
        }
    }, [branchList, allShifts])

    const [shiftData, setShiftData] = useState({
        shiftName: '',
        checkInTime: '',
        checkOutTime: '',
        gracePeriodMinutes: 10,
        earlyLeaveAllowanceMinutes: 10,
        isRotational: false,
        branchId: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let parsedValue: any = value;

        if (type === 'number') {
            parsedValue = Number(value);
        }

        if (name === 'isRotational') {
            parsedValue = value === 'true'; // convert string to boolean
        }

        if (name === 'branchId') {
            parsedValue = Number(value); // ensure branchId is numeric
        }

        setShiftData(prev => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let parsedValue: any = value;

        if (type === 'number') {
            parsedValue = Number(value);
        }

        if (name === 'isRotational') {
            parsedValue = value === 'true';
        }

        if (name === 'branchId') {
            parsedValue = Number(value);
        }

        setEditShiftData(prev => prev ? ({
            ...prev,
            [name]: parsedValue,
        }) : null);
    };


    const handleAddShift = async (e: any) => {
        e.preventDefault();

        const {
            shiftName,
            checkInTime,
            checkOutTime,
            gracePeriodMinutes,
            earlyLeaveAllowanceMinutes,
            isRotational,
            branchId,
        } = shiftData;

        if (!shiftName || !checkInTime || !checkOutTime || !branchId) {
            alert('Please fill all required fields');
            return;
        }

        const payload = {
            shiftName,
            checkInTime: checkInTime + ':00',
            checkOutTime: checkOutTime + ':00',
            gracePeriodMinutes,
            earlyLeaveAllowanceMinutes,
            isRotational,
            branchId: parseInt(branchId),
        };

        console.log(payload);

        try {
            const response = await axiosClient.post(ADD_NEW_SHIFT, payload);
            if ((response.status === 201)) {
                toast('Info', 'Shift record addedd successfully', 'success');
                setShiftData({
                    shiftName: '',
                    checkInTime: '',
                    checkOutTime: '',
                    gracePeriodMinutes: 10,
                    earlyLeaveAllowanceMinutes: 10,
                    isRotational: false,
                    branchId: '',
                });

                dispatch(fetchShifts());
            }

        } catch (error) {
            console.log(error);

            toast('Info', 'Something went wrong', 'danger');
        }


    };

    const handleEditShift = async (e: any) => {
        e.preventDefault();

        if (!editSHiftData) {
            console.warn("No data to edit");
            return;
        }
        try {
            
            const response= await axiosClient.put(`${EDIT_SHIFT}${editSHiftData.id}`,editSHiftData);
            if (response.status === 200) {
                toast('Info', 'Shift record updated successfully', 'success');
                dispatch(fetchShifts());
                setEditShiftData(null)
            }

        } catch (error) {
            console.log(error);
            toast('Error','someting went wrong','danger');
            
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
                            <h2 className="mb-1">Shifts </h2>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">Application</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Shifts{" "}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                            {
                                filteredLabels.includes('AddShift') &&
                                <div className="mb-2">
                                    <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add_shift"
                                        className="btn btn-primary d-flex align-items-center"
                                    >
                                        <i className="ti ti-circle-plus me-2" />
                                        Add Shift
                                    </Link>
                                </div>
                            }

                            <div className="head-icons ms-2">
                                <CollapseHeader />
                            </div>
                        </div>
                    </div>
                    {/* /Breadcrumb */}

                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h5>Shifts List</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="table-responsive p-2" style={{ height: '300px' }}>
                                <table className="table datanew table-bordered">
                                    <thead>
                                        <tr>
                                            <th className='py-3'>Id</th>
                                            <th className='py-3'>Shift Name</th>
                                            <th className='py-3'>Check In</th>
                                            <th className='py-3'>Check Out</th>
                                            <th className='py-3'>Late Punch (miniutes)</th>
                                            <th className='py-3'>Early Punch (miniutes)</th>
                                            <th className='py-3'>Branch</th>
                                            <th className='py-3'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            tableShifts.map(shift => (
                                                <tr key={shift.id}>
                                                    <td>{shift.id}</td>
                                                    <td>{shift.shiftName}</td>
                                                    <td>{shift.checkInTime}</td>
                                                    <td>{shift.checkOutTime}</td>
                                                    <td>{shift.gracePeriodMinutes}</td>
                                                    <td>{shift.earlyLeaveAllowanceMinutes}</td>
                                                    <td>{geBranchNameById(shift.branchId)}</td>
                                                    <td>
                                                        <div className="action-icon d-inline-flex">
                                                            <Link
                                                                to="#"
                                                                className="me-2"
                                                                data-bs-toggle="modal"
                                                                data-inert={true}
                                                                data-bs-target="#edit_shift"
                                                                onClick={() => setEditShiftData(shift)}
                                                            >
                                                                <i className="ti ti-edit" />
                                                            </Link>
                                                            <Link to="#" data-bs-toggle="modal" data-inert={true} data-bs-target="#delete_modal">
                                                                <i className="ti ti-trash" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                        {
                                            tableShifts.length === 0 &&
                                            <tr>
                                                <td colSpan={8}>No Shifts Record Found</td>
                                            </tr>
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

            {/* Add Shift */}
            <form onSubmit={(e) => handleAddShift(e)}>
                <div className="modal fade" id="add_shift">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add New Shift</h4>
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
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Shift Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text" name="shiftName"
                                                value={shiftData.shiftName}
                                                onChange={handleChange}
                                                required />
                                        </div>
                                    </div>

                                    {/* Check-in Time */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Check-In Time <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="time" name="checkInTime"
                                                value={shiftData.checkInTime}
                                                onChange={handleChange}
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
                                                value={shiftData.checkOutTime}
                                                onChange={handleChange}
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
                                                value={shiftData.gracePeriodMinutes}
                                                onChange={handleChange}
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
                                                value={shiftData.earlyLeaveAllowanceMinutes}
                                                onChange={handleChange}
                                                defaultValue={10} />
                                        </div>
                                    </div>

                                    {/* Branch ID */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Branch ID <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className="form-control"
                                                name="branchId"
                                                value={shiftData.branchId}
                                                onChange={handleChange}
                                                required>
                                                <option value="">---Select branch---</option>
                                                {
                                                    allBranches.map(branch => (
                                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                                    ))
                                                }
                                            </select>
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



            {/* edit shift */}
            <form onSubmit={(e) => handleEditShift(e)}>
                <div className="modal fade" id="edit_shift">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Edit Shift</h4>
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
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Shift Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text" name="shiftName"
                                                value={editSHiftData?.shiftName}
                                                onChange={handleEditChange}
                                                required />
                                        </div>
                                    </div>

                                    {/* Check-in Time */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Check-In Time <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="time" name="checkInTime"
                                                value={editSHiftData?.checkInTime}
                                                onChange={handleEditChange}
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
                                                value={editSHiftData?.checkOutTime}
                                                onChange={handleEditChange}
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
                                                value={editSHiftData?.gracePeriodMinutes}
                                                onChange={handleEditChange}
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
                                                value={editSHiftData?.earlyLeaveAllowanceMinutes}
                                                onChange={handleEditChange}
                                                defaultValue={10} />
                                        </div>
                                    </div>

                                    {/* Branch ID */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Branch ID <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className="form-control"
                                                name="branchId"
                                                value={editSHiftData?.branchId}
                                                onChange={handleEditChange}
                                                required>
                                                <option value="">---Select branch---</option>
                                                {
                                                    allBranches.map(branch => (
                                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-light me-2" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {/* edit shift */}
        </>

    );
}

export default ShiftsManagement