
import { Router } from 'express';
import { verifyToken } from '../config/authMiddleware.js';
import { AdminDashboard } from '../controller/mobileApp.controller.js';

const router =  Router();


 
router.route("/admindashboard").get([verifyToken],AdminDashboard );

 

export default router