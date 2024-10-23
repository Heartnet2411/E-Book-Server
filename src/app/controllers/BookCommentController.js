import { Book, Category, BookComment, User } from '../models/index.js'

class BookCommentController {
    async createComment(req, res) {
        try {
            const { bookId, comment, rating } = req.body
            const userId = req.user.userId // Lấy userId từ token

            const newComment = await BookComment.create({
                userId,
                bookId,
                comment,
                rating,
            })
            res.status(201).json(newComment)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log(error)
        }
    }

    // Get all comments for a book
    async getCommentsByBookId(req, res) {
        try {
            const { bookId } = req.params

            const comments = await BookComment.findAll({
                where: { bookId },
                include: [
                    {
                        model: User,
                        as: 'user', // Chú ý sử dụng đúng alias
                        attributes: ['firstName', 'lastName', 'avatar'],
                    },
                ],
            })

            res.status(200).json(comments)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log(error)
        }
    }

    // Update a comment
    async updateComment(req, res) {
        try {
            const { bookId } = req.params
            const { content, rating } = req.body
            const userId = req.user.userId // Lấy userId từ token

            const comment = await BookComment.findOne({
                where: { userId, bookId },
            })
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' })
            }

            comment.content = content
            comment.rating = rating
            await comment.save()

            res.status(200).json(comment)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Delete a comment
    async deleteComment(req, res) {
        try {
            const { bookId } = req.params
            const userId = req.user.userId // Lấy userId từ token

            const comment = await BookComment.findOne({
                where: { userId, bookId },
            })
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' })
            }

            await comment.destroy()
            res.status(200).json({ message: 'Comment deleted' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new BookCommentController()
