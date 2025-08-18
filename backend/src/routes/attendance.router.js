
import { Router } from 'express'; 
import multer from 'multer';
import { getCalenderAttendance, getCompanyAttendanceByDate, getUserAttendanceLogsByStartEndDate, getUserAttendanceSummaryOFUserByStartEndDateAndUserID, getUsersAttendancePerDay, markNewAttendance, uploadAttendanceExcel } from '../controller/attendance.controller.js';
import { verifyToken } from '../config/authMiddleware.js';
const router =  Router(); 


const upload = multer({ storage: multer.memoryStorage() });


router.route('/markattendance').post(markNewAttendance); 

router.route('/upload-attendance').post([verifyToken, upload.single('file')], uploadAttendanceExcel);

router.route('/companyAttendanceByDate/:companyId/:date').get([verifyToken],getCompanyAttendanceByDate);

router.route('/userAttendanceDetailsStartDateEndDateUserID').get([verifyToken],getUserAttendanceSummaryOFUserByStartEndDateAndUserID);
router.route('/attendanceLogsByUserIDStartDtEndDt').get([verifyToken],getUserAttendanceLogsByStartEndDate);

router.route('/UsersAttendanceDetailperday/:userId/:date').get([verifyToken],getUsersAttendancePerDay);

router.route('/attendancecalender').get([verifyToken],getCalenderAttendance);



export default router