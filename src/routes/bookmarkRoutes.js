import express from 'express'
const router = express.Router()
import authenticateToken from '../middleware/authenticateToken.js'
import bookmarkController from '../app/controllers/bookmarkController.js'

router.post('/create-bookmark',authenticateToken,bookmarkController.createBookmark)
router.get('/:userId/:bookId',authenticateToken,bookmarkController.getBookmarksByUserAndBook)
router.delete('/:bookmarkId' , authenticateToken,bookmarkController.deleteBookmark)
export default router