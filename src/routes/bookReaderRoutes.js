import express from 'express'
import BookReaderController from '../app/controllers/BookReaderController.js'
import authenticateToken from '../middleware/authenticateToken.js'
const router = express.Router()

router.post('/:bookId/read', authenticateToken, BookReaderController.userReader)

export default router
