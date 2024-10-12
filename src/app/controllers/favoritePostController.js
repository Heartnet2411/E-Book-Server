import { FavoritePost, User, Post } from '../models/index.js'

class FavoritePostController {
    // Đánh dấu một bài viết là yêu thích
    async addFavoritePost(req, res) {
        try {
            const { userId, postId } = req.body

            // Kiểm tra xem người dùng và bài viết có tồn tại không
            const user = await User.findByPk(userId)
            const post = await Post.findByPk(postId)

            if (!user || !post) {
                return res
                    .status(404)
                    .json({ message: 'User or Post not found' })
            }

            // Đánh dấu bài viết là yêu thích
            await FavoritePost.create({ userId, postId })

            res.status(201).json({
                message: 'Post added to favorites successfully',
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Xóa bài viết khỏi danh sách yêu thích
    async removeFavoritePost(req, res) {
        try {
            const { userId, postId } = req.body

            const favoritePost = await FavoritePost.findOne({
                where: { userId, postId },
            })

            if (!favoritePost) {
                return res
                    .status(404)
                    .json({ message: 'Favorite post not found' })
            }

            await favoritePost.destroy()

            res.status(200).json({
                message: 'Post removed from favorites successfully',
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Lấy tất cả bài viết yêu thích của một người dùng
    async getFavoritePosts(req, res) {
        try {
            const { userId } = req.params

            const user = await User.findByPk(userId, {
                include: [{ model: Post, as: 'favoritePosts' }],
            })

            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            res.status(200).json(user.favoritePosts)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new FavoritePostController()
