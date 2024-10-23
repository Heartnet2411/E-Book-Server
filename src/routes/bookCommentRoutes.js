import express from 'express'
import bookCommentController from '../app/controllers/bookCommentController.js'
import authenticateToken from '../middleware/authenticateToken.js'
const router = express.Router()

router.post('/', authenticateToken, bookCommentController.createComment)
router.get('/:bookId', bookCommentController.getCommentsByBookId)
router.put('/:bookId', authenticateToken, bookCommentController.updateComment)
router.delete(
    '/:bookId',
    authenticateToken,
    bookCommentController.deleteComment
)

export default router
