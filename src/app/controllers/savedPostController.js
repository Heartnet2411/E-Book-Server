import { SavedPost, User, Post } from '../models/index.js'

class SavedPostController {
    // Lưu một bài viết
    async savePost(req, res) {
        try {
            const postId = req.body.postId // Lấy postId từ body
            const userId = req.user.userId // Lấy userId từ thông tin xác thực

            // Kiểm tra xem bài viết có tồn tại không
            const post = await Post.findByPk(postId)

            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }

            // Kiểm tra xem bài viết đã được lưu trước đó chưa
            const existingSavedPost = await SavedPost.findOne({
                where: { userId, postId },
            })

            if (existingSavedPost) {
                return res
                    .status(400)
                    .json({ message: 'Post is already saved' })
            }

            // Lưu bài viết
            await SavedPost.create({ userId, postId })

            res.status(201).json({ message: 'Post saved successfully' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }

    // Xóa bài viết đã lưu
    async unsavePost(req, res) {
        const { postId } = req.body
        const userId = req.user.userId // Giả sử bạn đã xác thực người dùng

        try {
            const savedPost = await SavedPost.findOne({
                where: { userId, postId },
                include: [{ model: Post, as: 'post' }], // Sử dụng alias 'post'
            })

            if (!savedPost) {
                return res.status(404).json({ message: 'Saved post not found' })
            }

            await savedPost.destroy() // Xóa bài viết đã lưu
            res.status(200).json({ message: 'Saved post removed' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Lấy tất cả bài viết đã lưu của một người dùng
    async getSavedPosts(req, res) {
        const userId = req.user.userId // Giả sử bạn đã xác thực người dùng

        try {
            const savedPosts = await SavedPost.findAll({
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

            res.status(200).json(savedPosts)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getSavedPostByPostId(req, res) {
        try {
            const postId = req.params.postId // Lấy postId từ tham số URL
            const userId = req.user.userId // Lấy userId từ thông tin xác thực

            // Kiểm tra xem bài viết đã lưu có tồn tại hay không
            const savedPost = await SavedPost.findOne({
                where: {
                    userId,
                    postId,
                },
            })

            // Nếu tồn tại thì trả về true, ngược lại trả về false
            const isSaved = savedPost ? true : false
            res.status(200).json({ isSaved })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new SavedPostController()