
import { Router } from 'express'; 
import multer from 'multer';
import { getCompanyAttendanceByDate, getUserAttendanceLogsByStartEndDate, getUserAttendanceSummaryOFUserByStartEndDateAndUserID, markNewAttendance, uploadAttendanceExcel } from '../controller/attendance.controller.js';
import { verifyToken } from '../config/authMiddleware.js';
const router =  Router(); 


const upload = multer({ storage: multer.memoryStorage() });


router.route('/markattendance').post(markNewAttendance); 

router.route('/upload-attendance').post([verifyToken, upload.single('file')], uploadAttendanceExcel);

router.route('/companyAttendanceByDate/:companyId/:date').get(getCompanyAttendanceByDate);

router.route('/userAttendanceDetailsStartDateEndDateUserID').get(getUserAttendanceSummaryOFUserByStartEndDateAndUserID);
router.route('/attendanceLogsByUserIDStartDtEndDt').get(getUserAttendanceLogsByStartEndDate);



export default router