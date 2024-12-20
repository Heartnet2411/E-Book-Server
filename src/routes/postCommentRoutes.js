import express from 'express'
import PostCommentController from '../app/controllers/PostCommentController.js'
import authenticateToken from '../middleware/authenticateToken.js'
import authenticateAdmin from '../middleware/authenticateAdmin.js'

const router = express.Router()

// Tạo comment mới
router.post('/', authenticateToken, PostCommentController.createComment)

// Lấy tất cả comments của một post
router.get('/:postId', PostCommentController.getCommentsByPost)

// Cập nhật nội dung comment
router.put(
    '/:commentId',
    authenticateToken,
    PostCommentController.updateComment
)

// Xóa comment (chỉ set status thành false)
router.delete(
    '/:commentId',
    authenticateToken,
    PostCommentController.deleteComment
)
router.delete(
    '/delete-by-admin/:commentId',
    authenticateAdmin,
    PostCommentController.deleteCommentByAdmin
)

router.get('/:postId/total', PostCommentController.getTotalCommentsByPost)

export default router
