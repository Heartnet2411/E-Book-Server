import { Book, Category, BookComment, User } from '../models/index.js'
import { Sequelize } from 'sequelize'

class BookCommentController {
    async createComment(req, res) {
        try {
            const { bookId, comment, rating } = req.body
            const userId = req.user.userId // Lấy userId từ token

            if (!comment || !rating) {
                return res
                    .status(400)
                    .json({ message: 'Comment and rating is require.' })
            }

            if (rating > 5 || rating < 1) {
                return res.status(400).json({ message: '' })
            }

            const book = await Book.findByPk(bookId)

            if (!book) {
                return res.status(400).json({ message: 'No book found.' })
            }

            // Kiểm tra nếu user đã có bình luận cho cuốn sách này
            const existingComment = await BookComment.findOne({
                where: { userId, bookId },
            })

            if (existingComment) {
                return res
                    .status(400)
                    .json({ message: 'Bạn đã bình luận cho cuốn sách này.' })
            }

            // Nếu chưa có bình luận, tạo mới
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
                order: [['createdAt', 'DESC']], // Sắp xếp theo ngày mới nhất
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

            comment.comment = content
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

            const comment = await BookComment.findOne({
                where: { bookId },
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

    // Delete commnent by admin
    async deleteCommentByAdmin(req, res) {
        try {
            const { commentId } = req.params
            const comment = await BookComment.findOne({
                where: { commentId },
            })
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' })
            }
            await comment.destroy()
            res.status(204).json({ message: 'Comment deleted' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    async getRatingSummary(req, res) {
        try {
            const { bookId } = req.params

            // Lấy tổng số sao và số lượng đánh giá cho từng mức từ 1 đến 5 sao
            const ratings = await BookComment.findAll({
                where: { bookId },
                attributes: [
                    [
                        Sequelize.fn('COUNT', Sequelize.col('rating')),
                        'totalReviews',
                    ],
                    [
                        Sequelize.fn('SUM', Sequelize.col('rating')),
                        'totalStars',
                    ],
                    'rating',
                ],
                group: ['rating'],
                order: [['rating', 'ASC']],
            })

            // Tạo một object để tổng hợp kết quả đánh giá từ 1 đến 5 sao
            const ratingSummary = {
                totalStars: 0,
                totalReviews: 0,
                averageRating: 0,
                ratings: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                },
            }

            // Duyệt qua kết quả và tổng hợp vào ratingSummary
            ratings.forEach((rating) => {
                const starCount = rating.get('rating')
                const reviewCount = parseInt(rating.get('totalReviews'), 10)

                ratingSummary.totalStars += parseInt(
                    rating.get('totalStars'),
                    10
                )
                ratingSummary.totalReviews += reviewCount
                ratingSummary.ratings[starCount] = reviewCount
            })

            // Tính số sao trung bình nếu có ít nhất một đánh giá
            if (ratingSummary.totalReviews > 0) {
                ratingSummary.averageRating =
                    ratingSummary.totalStars / ratingSummary.totalReviews
            }

            res.status(200).json(ratingSummary)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log(error)
        }
    }

    async getBooksWithCommentsAndRatings(req, res) {
        try {
            const books = await Book.findAll({
                attributes: ['bookId', 'bookName', 'author', 'imageUrl'],
                include: [
                    {
                        model: BookComment,
                        as: 'comments',
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['firstName', 'lastName', 'avatar'],
                            },
                        ],
                        attributes: [
                            'commentId',
                            'comment',
                            'rating',
                            'createdAt',
                        ],
                    },
                ],
            })

            // Tính toán rating trung bình và số lượng bình luận sau khi lấy dữ liệu
            const processedBooks = books.map((book) => {
                const ratings = book.comments.map((comment) => comment.rating)
                const averageRating =
                    ratings.length > 0
                        ? (
                              ratings.reduce((sum, r) => sum + r, 0) /
                              ratings.length
                          ).toFixed(1)
                        : 0
                const totalComments = book.comments.length

                return {
                    ...book.toJSON(),
                    averageRating,
                    totalComments,
                }
            })

            res.status(200).json(processedBooks)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.error(error)
        }
    }
}

export default new BookCommentController()
