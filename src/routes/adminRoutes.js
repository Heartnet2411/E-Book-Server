import express from 'express'
const router = express.Router()
import adminController from '../app/controllers/adminController.js'
import authenticateAdmin from '../middleware/authenticateAdmin.js'

// Route để gán quyền Admin cho user
router.post('/assign-admin', authenticateAdmin, adminController.assignAdminRole)
router.post('/post/approved/:postId',authenticateAdmin,adminController.approvedPendingPost)
router.put('/post/rejected/:postId',authenticateAdmin,adminController.rejectPendingPost)
router.get('/users',authenticateAdmin,adminController.getAllUsers)
router.get('/comments/:filter',authenticateAdmin,adminController.getAllComment)
router.get('/hide-comments/:filter',authenticateAdmin,adminController.getHiddenComment)
router.post('/topic/approved/:topicId',authenticateAdmin,adminController.approvedPendingTopic)
router.put('/topic/rejected/:topicId',authenticateAdmin,adminController.rejectPendingTopic)

export default router
