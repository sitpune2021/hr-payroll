// routes/attendanceSetting.js
import express, { Router } from 'express';
import { checkPermission, verifyToken } from '../config/authMiddleware.js';
import { createShift, editShift, fetchShiftList } from '../controller/AttendanceSetting.controller.js';

const router = Router();
router.post('/create',[verifyToken, checkPermission('AddShift')], createShift);
router.put('/edit/:shiftId',[verifyToken, checkPermission('EditShift')], editShift);
router.get('/list',[verifyToken, checkPermission('Shift Management')], fetchShiftList);
export default router;
