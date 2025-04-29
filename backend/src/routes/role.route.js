import { Router } from "express";
import { addNewRole, getRolesList } from "../controller/role.controller.js";
import { checkPermission, verifyToken } from "../config/authMiddleware.js";


const router= Router();


router.route("/addrole").post([verifyToken, checkPermission('AddRole')], addNewRole);
router.route("/getlist").get([verifyToken], getRolesList);



export default router;