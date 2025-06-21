// routes/employeeShift.js

import express, { Router } from 'express';
import { addNewTemplate, editPayrollTemplateWithComponents, getListOfTemplate, getTempletesComponentList } from '../controller/payroll.template.controller.js';
import { verifyToken } from '../config/authMiddleware.js';

const router = Router();

router.post('/addNew',verifyToken, addNewTemplate);
router.get('/list',verifyToken, getListOfTemplate);
router.get('/templateCOmponents/:templateId',verifyToken, getTempletesComponentList);
router.put('/edit/:templateId',verifyToken, editPayrollTemplateWithComponents);

export default router;
