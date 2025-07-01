import express, { Router } from 'express';
import { checkPermission, verifyToken } from '../config/authMiddleware.js';
import { getWeeklyOffComponentsByTemplateId } from '../controller/weeklyOfComponents.controller.js';

const router= Router();
router.get('/listbytemplateId/:templateId',[verifyToken], getWeeklyOffComponentsByTemplateId);

export default router;
