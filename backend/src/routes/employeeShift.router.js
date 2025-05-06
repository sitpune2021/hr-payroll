// routes/employeeShift.js

import express from 'express';
import { assignShiftToEmployee } from '../controller/employeeShift.controller.js';

const router = express.Router();

router.post('/assign', assignShiftToEmployee);

export default router;
