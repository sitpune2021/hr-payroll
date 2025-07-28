import { Router } from "express";
import multer from 'multer';
import { checkPermission, verifyToken } from "../config/authMiddleware.js";
import { addNewUser, fetchCompanysUsers, getOrganizationTree, getTeamByUserId, getUserProfile, getUsersList, updateUserCOntrller, uploadUsersExcel } from "../controller/user.controller.js";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// checkPermission('AddUser')
router.route("/addUser").post([verifyToken,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'bankDetails', maxCount: 1 },
    { name: 'adhaarCard', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'educationalQualification', maxCount: 1 }
  ])
], addNewUser);
router.route("/getlist").get([verifyToken], getUsersList);
router.route("/editUser/:userId").put([verifyToken, checkPermission('EditUser')], updateUserCOntrller);
router.route('/uploaduserexcel').post([verifyToken, checkPermission('AddUser'), upload.single('file')], uploadUsersExcel);

router.route("/getcompanyusers/:companyId").get([verifyToken], fetchCompanysUsers);

router.route("/team/:userId").get([verifyToken], getTeamByUserId);
router.route("/orgtree/:userId").get([verifyToken], getOrganizationTree);

router.route("/profile/:userId").get([verifyToken], getUserProfile);






export default router;