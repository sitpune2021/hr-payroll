import { Router } from "express";
import { checkPermission, verifyToken } from "../config/authMiddleware.js";
import { AddNewDepartments, FetchDepartmentList } from "../controller/departments.controller.js";


const router= Router();


router.route("/addDepartments").post([verifyToken, checkPermission('AddDepartments')], AddNewDepartments);
router.route("/getlist").get([verifyToken], FetchDepartmentList);




export default router;