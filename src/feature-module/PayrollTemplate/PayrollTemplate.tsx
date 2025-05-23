import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { all_routes } from '../router/all_routes';
import CollapseHeader from '../../core/common/collapse-header/collapse-header';
import { toast } from '../../utils/toastUtil';
import axiosClient from '../../axiosConfig/axiosClient';
import { ADD_NEW_PAYROLL_TEMPLATE, EDIT_TEMPLATE_AND_COMPONENTS, FETCH_ALL_COMPONENTS_OF_TEMPLATE } from '../../axiosConfig/apis';
import { useAppSelector } from '../../core/data/redux/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../core/data/redux/store';
import { Company } from '../../core/data/redux/companySlice';
import { fetchPayrollTemplates, Template } from '../../core/data/redux/payrolltemplateSlice';

function PayrollTemplate() {
    interface PayrollComponent {
        id?: number;
        type: 'Allowance' | 'Deduction' | 'Bonus';
        name: string;
        amountType: 'Fixed' | 'Percentage';
        value: number;
        templateId?: number;
    }

    const dispatch = useDispatch<AppDispatch>();

    const [components, setComponents] = useState<PayrollComponent[]>([]);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

    const fetchTemplatesComponent = async (templateId: number) => {
        try {
            const response = await axiosClient.get(`${FETCH_ALL_COMPONENTS_OF_TEMPLATE}${templateId}`);
            if (response.status === 200) {
                setComponents([...response.data]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (editingTemplate?.id) {
            fetchTemplatesComponent(editingTemplate.id);
        }
    }, [editingTemplate])
    const handleCompChange = (idx: any, field: any, value: any) => {
        const newComps = [...components];
        newComps[idx] = { ...newComps[idx], [field]: value };
        setComponents(newComps);
    };

    const addComponent = () => {
        setComponents([...components, { type: 'Allowance', name: '', amountType: 'Fixed', value: 0, templateId: editingTemplate?.id }]);
    };

    const removeComponent = (idx: any) => {
        setComponents(components.filter((_, i) => i !== idx));
    };

    const companyList = useAppSelector((state) => state.companies.list);
    const user = useSelector((state: RootState) => state.auth.user);
    const payrollTemplates = useSelector((state: RootState) => state.payrollTemplate.templates);
    const [allcompany, setAllCompany] = useState<Company[]>([])
    const [allPayrollTemp, setAllPayrollTemp] = useState<Template[]>([])

    const getCompanyNameById = (companyId: number | undefined): string => {
        const company = companyList.find((comp) => comp.id === companyId);
        return company ? company.name : 'Unknown Company';
    };

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

        if (payrollTemplates.length > 0) {
            const loggedUsersCompany = companyList.find(
                (company) => company.id === user?.companyId
            );
            if (loggedUsersCompany) {
                setAllPayrollTemp(payrollTemplates.filter(temp => temp.companyId === loggedUsersCompany.id));
            } else {
                setAllPayrollTemp(payrollTemplates)
            }
        }



    }, [payrollTemplates, companyList, user?.companyId]);

    const [newTemplateName, setNewTemplateName] = useState("");
    const [newTemplateCompId, setNewTemplateCompId] = useState('');
    const handleAddTemplateSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (!newTemplateName.trim() || !newTemplateCompId.trim()) return toast('Info', 'Please enter data', 'warning');
            const response = await axiosClient.post(ADD_NEW_PAYROLL_TEMPLATE, {
                templateName: newTemplateName,
                companyId: newTemplateCompId
            });
            if (response.status === 201) {
                await dispatch(fetchPayrollTemplates());
                toast('Info', 'Payroll Template Added Successfully', 'success');
                setNewTemplateName('')
            }
        } catch (error: any) {
            console.log(error);

            toast('error', error.response.data.message, 'danger');
            console.log(error);

        }
    }


    const handleEditTemplateSubmit = async (e: any) => {
        e.preventDefault();

        const payload = {
            "templateName": editingTemplate?.templateName,
            "companyId": editingTemplate?.companyId,
            components
        }

        try {
            const response = await axiosClient.put(`${EDIT_TEMPLATE_AND_COMPONENTS}${editingTemplate?.id}`, payload);
            if (response.status === 200) {
                toast('Success', 'Template Updated Successfully', 'success');
            }
        } catch (error) {
            console.log(error);

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
                            <h2 className="mb-1">Payroll</h2>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={all_routes.adminDashboard}>
                                            <i className="ti ti-smart-home" />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">Application</li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Payroll{" "}
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
                                    Add New Payroll
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
                            <h5>Payroll Templates List</h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="table-responsive p-2">
                                <table className="table datanew table-bordered">
                                    <thead>
                                        <tr>
                                            <th className='py-3'>Sr. No.</th>
                                            <th>Template Name</th>
                                            <th>Company</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allPayrollTemp.map((template, index) => (
                                                <tr key={template.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{template.templateName}</td>
                                                    <td>{getCompanyNameById(template.companyId)}</td>
                                                    <td>
                                                        <div className="action-icon d-inline-flex">
                                                            {/* <Link to="#" className="me-2" data-bs-toggle="modal" data-bs-target="#company_detail">
                                                                <i className="ti ti-eye" />
                                                            </Link> */}
                                                            <Link to="#" className="me-2" data-bs-toggle="modal" data-bs-target="#edit_payroll_template">
                                                                <i className="ti ti-edit" onClick={() => setEditingTemplate(template)} />
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


            {/* Add Payroll */}
            <form onSubmit={(e) => handleAddTemplateSubmit(e)}>
                <div className="modal fade" id="add_company">
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add New Payroll Template</h4>
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
                                                value={newTemplateName}
                                                onChange={(e) => setNewTemplateName(e.target.value)}
                                                className="form-control"
                                                name='name'
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Select Company <span className="text-danger"> *</span>
                                            </label>
                                            <select
                                                name='companyId'
                                                value={newTemplateCompId}
                                                onChange={(e) => setNewTemplateCompId(e.target.value)}
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
            {/* /Add Payroll */}

            {/* Edit Payroll */}
            <div className="modal fade" id="edit_payroll_template">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Payroll Template</h4>
                            <h3>Company Name - <strong>{getCompanyNameById(editingTemplate?.companyId)}</strong></h3>
                            <button
                                type="button"
                                className="btn-close custom-btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={(e) => handleEditTemplateSubmit(e)}>
                            <div className="modal-body pb-0">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Template Name <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                type="text"
                                                name='templateName'
                                                value={editingTemplate?.templateName}
                                                onChange={(e) =>
                                                    setEditingTemplate(prev => prev ? { ...prev, templateName: e.target.value } : prev)
                                                }
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        {/* Components list */}
                                        <h6>Components</h6>
                                        {components.map((comp, idx) => (
                                            <div className="row align-items-end mb-2" key={idx}>
                                                <div className="col-md-2">
                                                    <label>Type</label>
                                                    <select
                                                        className="form-select"
                                                        value={comp.type}
                                                        onChange={e => handleCompChange(idx, 'type', e.target.value)}
                                                    >
                                                        <option>Allowance</option>
                                                        <option>Deduction</option>
                                                        <option>Bonus</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    <label>Name</label>
                                                    <input
                                                        type="text" className="form-control"
                                                        value={comp.name}
                                                        onChange={e => handleCompChange(idx, 'name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label>Amount Type</label>
                                                    <select
                                                        className="form-select"
                                                        value={comp.amountType}
                                                        onChange={e => handleCompChange(idx, 'amountType', e.target.value)}
                                                    >
                                                        <option>Fixed</option>
                                                        <option>Percentage</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    <label>Value</label>
                                                    <input
                                                        type="number" className="form-control"
                                                        value={comp.value}
                                                        onChange={e => handleCompChange(idx, 'value', parseFloat(e.target.value))}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-1">
                                                    <button type="button" className="btn btn-danger" onClick={() => removeComponent(idx)}>
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button type="button" className="btn btn-link" onClick={addComponent}>
                                            + Add Component
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
            {/* /Edit Payroll */}
        </>

    );
}

export default PayrollTemplate