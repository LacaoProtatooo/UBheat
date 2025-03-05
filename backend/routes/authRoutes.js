import express from 'express';
import { signup, login, logout, verifyEmail, getUserNotifications, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { isAuthenticatedUser, authorizeAdmin } from '../middleware/authuser.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.get('/notifications', getUserNotifications);
router.post('/logout', logout);

router.get('/current-user', isAuthenticatedUser, getCurrentUser);
router.put('/update', upload.single("upload_profile"), updateProfile);

export default router;