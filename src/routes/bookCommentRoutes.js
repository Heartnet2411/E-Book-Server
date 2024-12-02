import express from 'express'
import bookCommentController from '../app/controllers/BookCommentController.js'
import authenticateToken from '../middleware/authenticateToken.js'
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
router.get(
    '/statistic/with-comments-and-ratings',
    bookCommentController.getBooksWithCommentsAndRatings
)

export default router
