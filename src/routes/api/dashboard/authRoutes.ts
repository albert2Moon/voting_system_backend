import { Router } from "express";

import { getCurrentUser, loginUser, registerUser } from '../../../controllers/authController';

import { catchAsync } from "utils/catch_error";
import { authenticate } from "middlewares/auth";


const router = Router();

router.post('/register', catchAsync(registerUser));
router.post('/login', catchAsync(loginUser));
router.get('/me', authenticate, catchAsync(getCurrentUser));

module.exports = router;