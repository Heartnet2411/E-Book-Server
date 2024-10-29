import express from 'express'
import savedPostController from '../app/controllers/SavedPostController.js'
import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()

// Route để lưu một bài viết
router.post('/save', authenticateToken, savedPostController.savePost)

// Route để xóa bài viết đã lưu
router.delete('/unsave', authenticateToken, savedPostController.unsavePost)

// Route để lấy tất cả bài viết đã lưu của một người dùng
router.get('/:userId', authenticateToken, savedPostController.getSavedPosts)

router.get(
    '/savedPosts/:postId',
    authenticateToken,
    savedPostController.getSavedPostByPostId
)

export default router
