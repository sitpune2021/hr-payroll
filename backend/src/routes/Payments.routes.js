import express, { Router } from 'express';
import { calculatePaymentController, calculatePaymentForGroup } from '../controller/PaymentCalculation.controller.js';

const router = Router();

router.post('/calculate', calculatePaymentController);

router.post('/totalPayForCompanyINDates', calculatePaymentForGroup);

export default router;
