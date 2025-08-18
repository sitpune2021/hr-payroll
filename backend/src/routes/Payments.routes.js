import express, { Router } from 'express';
import { calculatePaymentController, calculatePaymentForGroup } from '../controller/PaymentCalculation.controller.js';
import { verifyToken } from '../config/authMiddleware.js';

const router = Router();

router.route('/calculate').post([verifyToken],calculatePaymentController);

router.route('/totalPayForCompanyINDates').post([verifyToken], calculatePaymentForGroup);

export default router;
