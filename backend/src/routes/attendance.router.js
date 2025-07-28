
import { Router } from 'express'; 
import multer from 'multer';
import { getCalenderAttendance, getCompanyAttendanceByDate, getUserAttendanceLogsByStartEndDate, getUserAttendanceSummaryOFUserByStartEndDateAndUserID, getUsersAttendancePerDay, markNewAttendance, uploadAttendanceExcel } from '../controller/attendance.controller.js';
import { verifyToken } from '../config/authMiddleware.js';
const router =  Router(); 


const upload = multer({ storage: multer.memoryStorage() });


router.route('/markattendance').post(markNewAttendance); 

router.route('/upload-attendance').post([verifyToken, upload.single('file')], uploadAttendanceExcel);

router.route('/companyAttendanceByDate/:companyId/:date').get(getCompanyAttendanceByDate);

router.route('/userAttendanceDetailsStartDateEndDateUserID').get(getUserAttendanceSummaryOFUserByStartEndDateAndUserID);
router.route('/attendanceLogsByUserIDStartDtEndDt').get(getUserAttendanceLogsByStartEndDate);

router.route('/UsersAttendanceDetailperday/:userId/:date').get(getUsersAttendancePerDay);

router.route('/attendancecalender').get(getCalenderAttendance);



export default router