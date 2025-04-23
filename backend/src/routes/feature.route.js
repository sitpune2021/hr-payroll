import { Router } from "express";
import { checkPermission, verifyToken } from "../config/authMiddleware.js";
import { addNewFeature, editFeatureCOntroller, getAllFeatures, getFeaturesByRole } from "../controller/feature.controlller.js";


const router= Router();


router.route("/addfeature").post([verifyToken, checkPermission('AddFeature')], addNewFeature);
router.route("/getfeaturetorole").get([verifyToken], getFeaturesByRole);
router.route("/getList").get([verifyToken], getAllFeatures);
router.route("/editfeature/:featureId").put([verifyToken, checkPermission('editFeature')], editFeatureCOntroller);



export default router;