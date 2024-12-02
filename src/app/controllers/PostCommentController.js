import { PostComment, User, Post } from '../models/index.js'

class PostCommentController {
    // Tạo mới một comment
    async createComment(req, res) {
        const { postId, replyId, content } = req.body
        const userId = req.user.userId // Lấy userId từ token

        if (!postId || !content) {
            return res
                .status(400)
                .json({ error: 'Post ID and content are required' })
        }

        try {
            const post = await Post.findByPk(postId)
            if (!post) {
                return res.status(404).json({ error: 'Post not found' })
            }
            const newComment = await PostComment.create({
                postId,
                userId,
                replyId,
                content,
            })
            res.status(201).json(newComment)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }

    // Lấy tất cả các comment của một bài post
    async getCommentsByPost(req, res) {
        const { postId } = req.params

        try {
            const comments = await PostComment.findAll({
                where: {
                    postId,
                    replyId: null, // Chỉ lấy các comment chính
                },
                include: [
                    {
                        model: PostComment,
                        as: 'Replies', // Sử dụng alias 'Replies' đã định nghĩa cho các reply
                        required: false, // Để khi không có reply, comment chính vẫn được lấy
                        include: {
                            model: User,
                            as: 'user',
                            attributes: ['avatar', 'firstname', 'lastname'],
                        },
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['avatar', 'firstname', 'lastname'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            })

            res.status(200).json(comments)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Cập nhật một comment
    async updateComment(req, res) {
        const { commentId } = req.params
        const { content } = req.body
        const userId = req.userId

        try {
            const comment = await PostComment.findOne({
                where: { commentId, userId },
            })

            if (!comment) {
                return res
                    .status(404)
                    .json({ error: 'Comment not found or unauthorized' })
            }

            comment.content = content
            await comment.save()

            res.status(200).json(comment)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Xóa một comment
    async deleteComment(req, res) {
        const { commentId } = req.params
        const userId = req.userId

        try {
            const comment = await PostComment.findOne({
                where: { commentId, userId },
            })

            if (!comment) {
                return res
                    .status(404)
                    .json({ error: 'Comment not found or unauthorized' })
            }

            // Set status to false instead of deleting the comment
            comment.status = false
            await comment.save()

            res.status(200).json({ message: 'Comment status set to inactive' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new PostCommentController()
