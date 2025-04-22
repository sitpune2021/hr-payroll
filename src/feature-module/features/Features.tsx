import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../router/all_routes'
import CollapseHeader from '../../core/common/collapse-header/collapse-header'
import PredefinedDateRanges from '../../core/common/datePicker'
import CommonSelect from '../../core/common/commonSelect'
import ImageWithBasePath from '../../core/common/imageWithBasePath'
import { toast } from '../../utils/toastUtil'
import axiosClient from '../../axiosConfig/axiosClient'
import { ADD_NEW_FEATURE } from '../../axiosConfig/apis'
import { useSelector } from 'react-redux'
import { RootState } from '../../core/data/redux/store'
import { f } from 'react-router/dist/development/fog-of-war-Cm1iXIp7'

function Features() {

        const features = useSelector((state: RootState) => state.feature.allFeatures);


    const [addFeatureData,setAddFeatureData] = useState(
        {
            name:"",
            description:""
        }
    )
    const handleAddFeatureSubmit=async (e:any) =>{
        e.preventDefault();
        if(!addFeatureData.name.trim() && !addFeatureData.description.trim()){
            toast('Info','Enter all fields','danger')
        }

        const response= await axiosClient.post(ADD_NEW_FEATURE,addFeatureData);
        if(response.status===201){
            toast('Success', `${response.data.message} | Feature added Successfully`,'success')
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
                            <h2 className="mb-1">Features</h2>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">Application</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Features List
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
                                    Add Feature
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
                            <h5>Branches List</h5>
                            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
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
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                    >
                                        Select Plan
                                    </Link>
                                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                Advanced
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                Basic
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                Enterprise
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="dropdown me-3">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                    >
                                        Select Status
                                    </Link>
                                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                Active
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="dropdown-item rounded-1"
                                            >
                                                Inactive
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="dropdown">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
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
                            </div>
                        </div>
                        <div className="card-body p-2">
                            <div className="table-responsive p-2" style={{height:'300px'}}>
                                <table className="table datanew table-bordered">
                                    <thead>
                                        <tr>
                                            <th className='py-3'>Id</th>
                                            <th className='py-3'>Feature Name</th>
                                            <th className='py-3'>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            features.map(feature=>(
                                                <tr key={feature.id}>
                                                    <td>{feature.id}</td>
                                                    <td>{feature.name}</td>
                                                    <td>{feature.description}</td>
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
            {/* Add Feature */}
            <form onSubmit={(e)=>handleAddFeatureSubmit(e)}>
                <div className="modal fade" id="add_company">
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add New Feature</h4>
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
                                                Feature Name <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                value={addFeatureData.name}
                                                onChange={(e) => setAddFeatureData({ ...addFeatureData, name: e.target.value })}
                                                className='form-control'
                                                type="text"
                                                name='name' />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Feature Description <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                onChange={(e) => setAddFeatureData({ ...addFeatureData, description: e.target.value })}
                                                value={addFeatureData.description}
                                                className='form-control'
                                                type="text"
                                                name='name' />
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
                                    Add Feature
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
            {/* /Add Company */}
            {/* Edit Company */}
            <div className="modal fade" id="edit_company">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Company</h4>
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
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Name <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name='name'
                                                className="form-control"
                                                defaultValue="Stellar Dynamics"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Email Address</label>
                                            <input
                                                type="email"
                                                name='email'
                                                className="form-control"
                                                defaultValue="sophie@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Phone Number <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name='phone'
                                                className="form-control"
                                                defaultValue="+1 895455450"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Address</label>
                                            <input
                                                type="text"
                                                name='address'
                                                className="form-control"
                                                defaultValue="Admin Website"
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
                                <button type="submit" data-bs-dismiss="modal" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Edit Company */}
            {/* branch Detail */}
            <div className="modal fade" id="company_detail">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Branch Detail</h4>
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
                                        <Link
                                            to="#"
                                            className="avatar avatar-md border rounded-circle flex-shrink-0 me-2"
                                        >
                                            <ImageWithBasePath
                                                src="assets/img/company/company-01.svg"
                                                className="img-fluid"
                                                alt="img"
                                            />
                                        </Link>
                                        <div>
                                            <p className="text-gray-9 fw-medium mb-0">
                                                enter name
                                            </p>
                                            <p>enter email</p>
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
                                                <p className="text-gray-9">enter phone</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Created Date</p>
                                                <p className="text-gray-9">enter date</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Address</p>
                                                <p className="text-gray-9">enter address</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <p className="fs-12 mb-0">Company Name</p>
                                                <p className="text-gray-9">
                                                    Enter company name
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
            {/* /branch Detail */}
        </>
    )
}

export default Features