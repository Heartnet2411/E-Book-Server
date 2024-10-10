// routes/postRoutes.js
import express from 'express'
import PostController from '../app/controllers/postController.js'
import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()

router.get('/', PostController.getAllPosts)

router.post('/', authenticateToken, PostController.createPost)

router.put('/:postId', authenticateToken, PostController.updatePost)

router.delete('/:postId', authenticateToken, PostController.deletePost)

export default router
