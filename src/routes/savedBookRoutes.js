import express from 'express'
import SavedBookController from '../app/controllers/SavedBookController.js'
import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()

// Route để lưu sách
router.post('/save-book', authenticateToken, SavedBookController.saveBook)

// Route để bỏ lưu sách
router.post('/unsave-book', authenticateToken, SavedBookController.unsaveBook)

// Route để lấy sách đã lưu của người dùng
router.get('/saved-books', authenticateToken, SavedBookController.getSavedBooks)

router.get(
    '/is-book-saved/:bookId',
    authenticateToken,
    SavedBookController.isBookSaved
)

export default router
