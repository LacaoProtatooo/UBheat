import express from 'express';
import { signup, verifyEmail, login, googlelogin, logout, forgotPassword, resetPassword, getUsers, getUserById, getCurrentUser, updateProfile, updateUserStatus, getUserNotifications } from '../controllers/authController.js';
import { isAuthenticatedUser, authorizeAdmin } from '../middleware/authuser.js';
import upload from '../utils/multer.js';

const router = express.Router();

// Existing routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googlelogin);
router.post('/logout', logout);
router.post('/verifyemail', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

router.get('/current-user', isAuthenticatedUser, getCurrentUser);
router.put('/update', upload.single("upload_profile"), updateProfile);

// Admin routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUserStatus);
router.get('/notifications', getUserNotifications);

// router.get('/users', isAuthenticatedUser ,getUsers, authorizeAdmin);
// router.get('/users/:id', isAuthenticatedUser, getUserById, authorizeAdmin);
// router.patch('/users/:id', isAuthenticatedUser, authorizeAdmin, updateUserStatus);


export default router;