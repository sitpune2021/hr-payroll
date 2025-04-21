
import { Router } from 'express';
import { getUserDataController, loginController, registerController } from '../controller/auth.controller.js';
import { checkRole, verifyToken } from '../config/authMiddleware.js';

const router =  Router();


router.route('/login').post(loginController) 
router.route('/register').post(registerController) 
router.route("/getUser").get([verifyToken], getUserDataController);




// Protected routes
router.get('/superadmin-dashboard', verifyToken, checkRole(['SUPER_ADMIN']), (req, res) => {
    res.json({ message: 'Welcome to the SUPER_ADMIN dashboard!' });
  });
  
  router.get('/company-dashboard', verifyToken, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), (req, res) => {
    res.json({ message: 'Welcome to the COMPANY_ADMIN dashboard!' });
  });
  
  router.get('/employee-profile', verifyToken, checkRole(['BRANCH_MANAGER', 'EMPLOYEE']), (req, res) => {
    res.json({ message: `Welcome ${req.user.email}, this is your profile!` });
  });
  
 

export default router