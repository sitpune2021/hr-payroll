import { Router } from "express";
import { checkRole, verifyToken } from '../config/authMiddleware.js';
import { createHolidayGroup, listHolidayGroups } from "../controller/holidayGroup.Controller.js";


const router =  Router();

router.route("/addnewholidaygroup").post(verifyToken, createHolidayGroup );
router.route("/listall").get(verifyToken, listHolidayGroups );

export default router;
