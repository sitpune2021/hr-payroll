import { Router } from 'express';
import multer from 'multer';
import { verifyToken, checkPermission } from '../config/authMiddleware.js';
import { addNewBranch, fetchListBranches, updateBranch } from '../controller/branch.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/addnewbranch').post(
  [
    verifyToken,
    checkPermission('AddBranch'),
    upload.fields([
      { name: 'branchLogo', maxCount: 1 },
      { name: 'bankDetails', maxCount: 1 }
    ])
  ],
  addNewBranch
);


router.route('/getlist').get( [verifyToken],fetchListBranches)

router.route('/updatebranch/:branchId').put(
  [verifyToken, checkPermission('EditBranch')], 
  updateBranch
);

export default router;
