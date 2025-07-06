import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../router/all_routes'
import CollapseHeader from '../../core/common/collapse-header/collapse-header'
import PredefinedDateRanges from '../../core/common/datePicker'
import CommonSelect from '../../core/common/commonSelect'
import ImageWithBasePath from '../../core/common/imageWithBasePath'
import { toast } from '../../utils/toastUtil'
import axiosClient from '../../axiosConfig/axiosClient'
import { ADD_NEW_FEATURE, EDIT_FEATURE } from '../../axiosConfig/apis'
import { useSelector } from 'react-redux'
import { RootState } from '../../core/data/redux/store'
import { Feature } from '../../core/data/redux/featureSlice'

function Features() {

    const [editFeatureData, setEditFeatureData] = useState<Feature>({
        id: 0,
        name: '',
        description: ''
      });

      const handleEditFeatureSubmit = async (e:any) => {
        e.preventDefault();
        const {name,description}= editFeatureData;

        try {
            const response= await axiosClient.put(`${EDIT_FEATURE}${editFeatureData.id}`,{
                name,
                description
            });
            if(response.status===200){
                toast('Info',"Feature updated Successfully", 'success')
            }
        } catch (error) {
            toast('Error', 'Failed to update feature', 'danger')
            console.log(error);
            
        }
        
      }
      

    const features = useSelector((state: RootState) => state.feature.allFeatures);


    const [addFeatureData, setAddFeatureData] = useState(
        {
            name: "",
            description: ""
        }
    )
    const handleAddFeatureSubmit = async (e: any) => {
        e.preventDefault();
        if (!addFeatureData.name.trim() && !addFeatureData.description.trim()) {
            toast('Info', 'Enter all fields', 'danger')
        }

        const response = await axiosClient.post(ADD_NEW_FEATURE, addFeatureData);
        if (response.status === 201) {
            toast('Success', `${response.data.message} | Feature added Successfully`, 'success')
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
                                    data-bs-target="#add_feature"
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
                            <h5>Features List</h5>
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
                            <div className="table-responsive p-2" style={{ height: '300px' }}>
                                <table className="table datanew table-bordered">
                                    <thead>
                                        <tr>
                                            <th className='py-3'>Id</th>
                                            <th className='py-3'>Feature Name</th>
                                            <th className='py-3'>Description</th>
                                            <th className='py-3'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            features.map(feature => (
                                                <tr key={feature.id}>
                                                    <td>{feature.id}</td>
                                                    <td>{feature.name}</td>
                                                    <td>{feature.description}</td>
                                                    <td>
                                                        <div className="action-icon d-inline-flex">
                                                            <Link
                                                                to="#"
                                                                className="me-2"
                                                                data-bs-toggle="modal"
                                                                onClick={()=>setEditFeatureData(feature)}
                                                                data-inert={true}
                                                                data-bs-target="#edit_feature"
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
            <form onSubmit={(e) => handleAddFeatureSubmit(e)}>
                <div className="modal fade" id="add_feature">
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
            {/* /Add Feature */}
            {/* Edit Feature */}
            <div className="modal fade" id="edit_feature">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Feature</h4>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={(e)=>handleEditFeatureSubmit(e)}>
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Name <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editFeatureData?.name}
                                                readOnly
                                                name='name'
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Descrption
                                            </label>
                                            <input
                                                type="text"
                                                value={editFeatureData?.description}
                                                onChange={(e)=>setEditFeatureData({...editFeatureData,description:e.target.value})}
                                                name='description'
                                                className="form-control"
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
            {/* /Edit Feature */}
        </>
    )
}

export default Features