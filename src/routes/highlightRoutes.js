import express from 'express'
const router = express.Router()
import authenticateToken from '../middleware/authenticateToken.js'
import highlightController from '../app/controllers/highlightController.js'

router.post('/create-highlight',authenticateToken,highlightController.createHighlight)
router.get('/:userId/:bookId',authenticateToken,highlightController.getHighlights)
router.delete('/:highlightId',authenticateToken,highlightController.deleteHighlight)
export default router