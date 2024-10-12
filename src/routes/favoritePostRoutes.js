import express from 'express'
import favoritePostController from '../app/controllers/favoritePostController.js'
import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()

// Route để thêm bài viết vào danh sách yêu thích
router.post('/add', authenticateToken, favoritePostController.addFavoritePost)

// Route để xóa bài viết khỏi danh sách yêu thích
router.delete(
    '/remove',
    authenticateToken,
    favoritePostController.removeFavoritePost
)

// Route để lấy tất cả bài viết yêu thích của một người dùng
router.get(
    '/users/:userId',
    authenticateToken,
    favoritePostController.getFavoritePosts
)

export default router
