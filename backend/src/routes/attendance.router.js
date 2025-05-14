
import { Router } from 'express'; 
import multer from 'multer';
import { markNewAttendance, uploadAttendanceFile } from '../controller/attendance.controller.js';
const router =  Router();


const upload = multer({ storage: multer.memoryStorage() });


router.route('/markattendance').post(markNewAttendance); 
router.post('/upload-attendance', upload.single('file'), uploadAttendanceFile);

export default router