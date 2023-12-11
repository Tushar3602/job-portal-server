import { Router } from 'express';
const router = Router();
import {
  getCurrentUser,
  updateUser,
  getAllUsers,
} from '../controllers/userController.js';

import { updateUserInput } from '../middleware/validationMiddleware.js';
import upload from '../middleware/multerMiddleware.js';

router.route('/current-user').get(getCurrentUser);

router
  .route('/update-user')
  .patch(upload.single('avatar'), updateUserInput, updateUser);

router.route('/get-all-users').get(getAllUsers);


export default router;
