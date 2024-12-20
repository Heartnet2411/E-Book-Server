import express from 'express'
import bookController from '../app/controllers/BookController.js'
const router = express.Router()

router.post('/', bookController.createBook)
router.get('/', bookController.getAllBooks)
router.get('/search', bookController.searchBooks)
router.get('/:bookId', bookController.getBookById)
router.put('/:bookId', bookController.updateBook)
router.delete('/:bookId', bookController.deleteBook)

export default router
