import express from 'express'
const router = express.Router()
import adminController from '../app/controllers/adminController.js'
import authenticateAdmin from '../middleware/authenticateAdmin.js'

// Route để gán quyền Admin cho user
router.post('/assign-admin', authenticateAdmin, adminController.assignAdminRole)
router.get('/users',authenticateAdmin,adminController.getAllUsers)

export default router
