
import { Router } from 'express'; 
import multer from 'multer';
import { checkPermission, verifyToken } from '../config/authMiddleware.js';
import { addnewcompany, companyProfile, fetchListOfCompanies, updatecompany } from '../controller/company.controller.js';

const router =  Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/addcompany').post([verifyToken, checkPermission('AddCompany'),upload.single('companyImage')], addnewcompany); 
router.route('/getList').get([verifyToken], fetchListOfCompanies); 
router.route('/updatecompany/:companyId').put([verifyToken, checkPermission('EditCompany'),upload.single('companyImage')], updatecompany) 

router.route('/profile/:companyId').get(companyProfile)


 

export default router