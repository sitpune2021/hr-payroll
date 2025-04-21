import { Router } from "express";
import multer from 'multer';
import { checkPermission, verifyToken } from "../config/authMiddleware.js";
import { addNewUser, getUsersList, updateUserCOntrller, uploadUsersExcel } from "../controller/user.controller.js";


const router= Router();
const upload = multer({ storage: multer.memoryStorage() });


router.route("/addUser").post([verifyToken, checkPermission('AddUser')], addNewUser);
router.route("/getlist").get([verifyToken], getUsersList);
router.route("/editUser/:userId").put([verifyToken,checkPermission('EditUser')], updateUserCOntrller);
router.route('/uploaduserexcel').post([verifyToken, checkPermission('AddUser'),upload.single('file')], uploadUsersExcel); 




export default router;