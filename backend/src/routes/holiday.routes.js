import { Router } from "express";
import { checkRole, verifyToken } from '../config/authMiddleware.js';
import { addHoliday, getHolidaysByGroup } from "../controller/holiday.Controller.js";


const router =  Router();

router.route("/addnewholiday").post(verifyToken, addHoliday );
router.route("/getbygroupid/:groupId").get(verifyToken, getHolidaysByGroup );

export default router;
