import { Router } from "express";
import { verifyToken } from "../config/authMiddleware.js";
import { applyLeave, editLeaveIfApplied, fetchUsersLeaveRecordStats, getCompanyLeaveRecords, getLeaveById, updateLeaveStatus, userLeaveDetailsController } from "../controller/leaveRecordController.js";



    const router = Router();

    router.route("/applyleave").post( applyLeave ); 

    router.route("/updateLeaveStatus").post( updateLeaveStatus );  

    router.route("/fetchusersLeaverecordstats/:userId").get( fetchUsersLeaveRecordStats );

    router.route("/fetchCompanyLeaverecord").get( getCompanyLeaveRecords );

    router.route("/userLeaveDetails").get( userLeaveDetailsController );
    
    router.route("/leaves/:leaveId").get( getLeaveById );

    router.route("/leaves/:leaveId").put( editLeaveIfApplied );


 


    export default router;

    