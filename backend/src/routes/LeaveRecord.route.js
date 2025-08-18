import { Router } from "express";
import { verifyToken } from "../config/authMiddleware.js";
import { applyLeave, editLeaveIfApplied, fetchUsersLeaveRecordStats, getCompanyLeaveRecords, getLeaveById, updateLeaveStatus, userLeaveDetailsController } from "../controller/leaveRecordController.js";



    const router = Router();

    router.route("/applyleave").post([verifyToken], applyLeave ); 

    router.route("/updateLeaveStatus").post([verifyToken], updateLeaveStatus );  

    router.route("/fetchusersLeaverecordstats/:userId").get( [verifyToken],fetchUsersLeaveRecordStats );

    router.route("/fetchCompanyLeaverecord").get([verifyToken], getCompanyLeaveRecords );

    router.route("/userLeaveDetails").get([verifyToken], userLeaveDetailsController );
    
    router.route("/leaves/:leaveId").get([verifyToken], getLeaveById );

    router.route("/leaves/:leaveId").put([verifyToken], editLeaveIfApplied );


 


    export default router;

    