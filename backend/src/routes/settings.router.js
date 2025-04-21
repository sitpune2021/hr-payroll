import { Router } from "express";
import {updatePermissionsForRole } from "../controller/edit.rolePermission.controller.js";
import { checkPermission, verifyToken } from "../config/authMiddleware.js";



const router=Router();


router.route("/roles/:roleId/permissions/:permissionId/toggle").post([verifyToken, checkPermission('TOGGLE_PERMISSION')], updatePermissionsForRole);


export default router; 