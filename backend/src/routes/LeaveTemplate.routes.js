import express, { Router } from 'express';
import { verifyToken } from '../config/authMiddleware.js';
import { addNewLeaveTemplate } from '../controller/LeaveTemplate.controller.js';


const router = Router();

router.route('/addnewleavetemplate').post([verifyToken], addNewLeaveTemplate);


export default router;