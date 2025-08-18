// routes/employeeShift.js

import express from 'express';
import { assignShiftToEmployee } from '../controller/employeeShift.controller.js';
import { verifyToken } from '../config/authMiddleware.js';

const router = express.Router();


router.route("/assign").post([verifyToken], assignShiftToEmployee);

export default router;
