import express, { Router } from 'express';
import { verifyToken } from '../config/authMiddleware.js';
import { addNewLeaveTemplate, editLeaveTemplateWithComponents, getListOfLeaveTemplate } from '../controller/LeaveTemplate.controller.js';


const router = Router();

router.route('/addnewleavetemplate').post([verifyToken], addNewLeaveTemplate);

router.route('/getleavetemplatelist').get([verifyToken], getListOfLeaveTemplate);

router.route('/edittemplatewithcomponent/:templateId').put([verifyToken], editLeaveTemplateWithComponents);




export default router;