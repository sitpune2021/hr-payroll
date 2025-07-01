import express, { Router } from 'express';
import { calculatePaymentController } from '../controller/PaymentCalculation.controller.js';

const router = Router();

router.post('/calculate', calculatePaymentController);

export default router;
