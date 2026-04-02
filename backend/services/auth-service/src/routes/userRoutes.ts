import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// Get metadata (roles, departments)
router.get('/metadata', userController.getMetadata);

// User CRUD operations (admin only)
router.get('/', requireAdmin, userController.getUsers);
router.post('/', requireAdmin, userController.createUser);
router.get('/:id', requireAdmin, userController.getUserById);
router.put('/:id', requireAdmin, userController.updateUser);
router.delete('/:id', requireAdmin, userController.deleteUser);

// User status management
router.post('/:id/deactivate', requireAdmin, userController.deactivateUser);
router.post('/:id/activate', requireAdmin, userController.activateUser);

// Password reset (admin)
router.post('/:id/reset-password', requireAdmin, userController.resetUserPassword);

// Audit logs
router.get('/:id/audit-logs', requireAdmin, userController.getUserAuditLogs);

export default router;
