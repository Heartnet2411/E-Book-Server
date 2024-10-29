import { FavoritePost, User, Post } from '../models/index.js'

class FavoritePostController {
    // Đánh dấu một bài viết là yêu thích
    async addFavoritePost(req, res) {
        try {
            const postId = req.body.postId // Lấy postId từ body
            const userId = req.user.userId // Lấy userId từ thông tin xác thực

            // Kiểm tra xem bài viết có tồn tại không
            const post = await Post.findByPk(postId)
            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }

            // Kiểm tra xem bài viết đã được đánh dấu yêu thích chưa
            const existingFavoritePost = await FavoritePost.findOne({
                where: { userId, postId },
            })
            if (existingFavoritePost) {
                return res
                    .status(400)
                    .json({ message: 'Post is already in favorites' })
            }

            // Thêm bài viết vào danh sách yêu thích
            await FavoritePost.create({ userId, postId })
            res.status(201).json({
                message: 'Post added to favorites successfully',
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: error.message })
        }
    }

    // Xóa bài viết khỏi danh sách yêu thích
    async removeFavoritePost(req, res) {
        try {
            const postId = req.body.postId
            const userId = req.user.userId

            // Tìm bài viết yêu thích
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
            console.error(error)
            res.status(500).json({ error: error.message })
        }
    }

    // Lấy tất cả bài viết yêu thích của một người dùng
    async getFavoritePosts(req, res) {
        const userId = req.user.userId

        try {
            const favoritePosts = await FavoritePost.findAll({
                where: { userId },
                include: [
                    {
                        model: Post,
                        as: 'post',
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['avatar', 'firstname', 'lastname'],
                            },
                        ],
                    },
                ],
            })

            res.status(200).json(favoritePosts)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: error.message })
        }
    }

    // Kiểm tra xem bài viết có nằm trong danh sách yêu thích không
    async getFavoritePostByPostId(req, res) {
        try {
            const postId = req.params.postId
            const userId = req.user.userId

            const favoritePost = await FavoritePost.findOne({
                where: { userId, postId },
            })

            const isFavorite = favoritePost ? true : false
            res.status(200).json({ isFavorite })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: error.message })
        }
    }
}

export default new FavoritePostController()
