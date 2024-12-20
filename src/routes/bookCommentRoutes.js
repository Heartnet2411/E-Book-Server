import express from 'express'
import bookCommentController from '../app/controllers/BookCommentController.js'
import authenticateToken from '../middleware/authenticateToken.js'
import authenticateAdmin from '../middleware/authenticateAdmin.js'
const router = express.Router()

router.post('/', authenticateToken, bookCommentController.createComment)
router.get('/sumary/:bookId', bookCommentController.getRatingSummary)
router.get('/:bookId', bookCommentController.getCommentsByBookId)
router.put('/:bookId', authenticateToken, bookCommentController.updateComment)
router.delete(
    '/:bookId',
    authenticateToken,
    bookCommentController.deleteComment
)
router.delete(
    '/delete-by-admin/:commentId',
    authenticateAdmin,
    bookCommentController.deleteCommentByAdmin
)

export default router
