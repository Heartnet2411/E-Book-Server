import express from 'express'
import RecommendBookController from '../app/controllers/RecommendBookController.js'
import authenticateToken from '../middleware/authenticateToken.js'
const router = express.Router()

router.get('/', authenticateToken, RecommendBookController.recommendBooks)

export default router
