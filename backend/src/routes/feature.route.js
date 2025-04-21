import { Router } from "express";
import { checkPermission, verifyToken } from "../config/authMiddleware.js";
import { addNewFeature, getAllFeatures, getFeaturesByRole } from "../controller/feature.controlller.js";


const router= Router();


router.route("/addfeature").post([verifyToken, checkPermission('ADD_FEATURE')], addNewFeature);
router.route("/getfeaturetorole").get([verifyToken], getFeaturesByRole);
router.route("/getList").get([verifyToken], getAllFeatures);



export default router;