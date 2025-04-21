import { Router } from 'express';
import { verifyToken, checkPermission } from '../config/authMiddleware.js';
import { addNewBranch, fetchListBranches, updateBranch } from '../controller/branch.controller.js';

const router = Router();

router.route('/addnewbranch').post(
  [verifyToken, checkPermission('AddBranch')], 
  addNewBranch
);

router.route('/getlist').get( [verifyToken],fetchListBranches)

router.route('/updatebranch/:branchId').put(
  [verifyToken, checkPermission('EditBranch')], 
  updateBranch
);

export default router;
