import { Router } from "express";
import {fetchRolesPermissionsLinking, updatePermissionsForRole } from "../controller/edit.rolePermission.controller.js";
import { checkPermission, verifyToken } from "../config/authMiddleware.js";



const router=Router();


router.route("/roles/:roleId/permissions/:permissionId/toggle").post([verifyToken], updatePermissionsForRole);
router.route("/rolespermissions").get([verifyToken, checkPermission('fetchRolesPermissions')], fetchRolesPermissionsLinking);



export default router; 