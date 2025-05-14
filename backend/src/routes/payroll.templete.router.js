// routes/employeeShift.js

import express from 'express';
import { addNewTemplate, editPayrollTemplateWithComponents, getListOfTemplate, getTempletesComponentList } from '../controller/payroll.template.controller.js';

const router = express.Router();

router.post('/addNew', addNewTemplate);
router.get('/list', getListOfTemplate);
router.get('/templateCOmponents/:templateId', getTempletesComponentList);
router.put('/edit/:templateId', editPayrollTemplateWithComponents);

export default router;
