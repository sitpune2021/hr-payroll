
import { Router } from 'express'; 
import multer from 'multer';
import { getCompanyAttendanceByDate, getUserAttendanceSummaryOFUserByStartEndDateAndUserID, markNewAttendance, uploadAttendanceFile } from '../controller/attendance.controller.js';
const router =  Router(); 


const upload = multer({ storage: multer.memoryStorage() });


router.route('/markattendance').post(markNewAttendance); 
router.post('/upload-attendance', upload.single('file'), uploadAttendanceFile);

router.route('/companyAttendanceByDate/:companyId/:date').get(getCompanyAttendanceByDate);

router.route('/userAttendanceDetailsStartDateEndDateUserID').get(getUserAttendanceSummaryOFUserByStartEndDateAndUserID);


export default router