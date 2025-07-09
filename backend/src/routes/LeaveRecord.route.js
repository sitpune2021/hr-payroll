import { Router } from "express";
import { verifyToken } from "../config/authMiddleware.js";
import { applyLeave, fetchUsersLeaveRecordStats, getCompanyLeaveRecords, updateLeaveStatus } from "../controller/leaveRecordController.js";



    const router = Router();

    router.route("/applyleave").post( applyLeave ); 

    router.route("/updateLeaveStatus").post( updateLeaveStatus );  

    router.route("/fetchusersLeaverecordstats/:userId").get( fetchUsersLeaveRecordStats );

    router.route("/fetchCompanyLeaverecord").get( getCompanyLeaveRecords );
 


    export default router;

    