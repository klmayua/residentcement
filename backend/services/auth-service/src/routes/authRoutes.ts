import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.confirmPasswordReset);

// Protected routes
router.use(authenticateToken);

router.get('/me', authController.getMe);
router.post('/change-password', authController.changePassword);

// MFA routes
router.post('/mfa/setup', authController.setupMFA);
router.post('/mfa/verify', authController.verifyAndEnableMFA);
router.post('/mfa/disable', authController.disableMFA);

export default router;
