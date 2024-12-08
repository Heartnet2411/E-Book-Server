import {
    User,
    Role,
    Post,
    Book,
    BookComment,
    PostComment,
} from '../models/index.js'
import sequelize from '../../connection/connection.js'
class adminController {
    // Hàm gán quyền Admin cho một user
    assignAdminRole = async (req, res) => {
        const { userId } = req.body // Hoặc sử dụng email: const { email } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        try {
            // Tìm Role 'Admin'
            const adminRole = await Role.findOne({
                where: { roleName: 'Admin' },
            })
            if (!adminRole) {
                return res
                    .status(500)
                    .json({ message: 'Admin role not found in the database' })
            }

            // Tìm người dùng cần gán quyền Admin
            const user = await User.findByPk(userId, { include: 'role' })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Kiểm tra xem user đã là Admin chưa
            if (user.role.roleName === 'Admin') {
                return res
                    .status(400)
                    .json({ message: 'User is already an Admin' })
            }

            // Cập nhật roleId của user thành Admin
            user.roleId = adminRole.roleId
            await user.save()

            res.status(200).json({
                message: 'User has been granted Admin role successfully',
                user,
            })
        } catch (error) {
            console.error('Error in assignAdminRole:', error)
            res.status(500).json({
                message: 'Failed to assign Admin role',
                error,
            })
        }
    }
    // Lấy thông tin tất cả người dùng
    async getAllUsers(req, res) {
        try {
            // Lấy thông tin tất cả người dùng
            const users = await User.findAll({
                include: 'role', // Bao gồm thông tin role của user
            })

            // Trả về danh sách người dùng
            res.status(200).json(users)
        } catch (error) {
            // Xử lý lỗi và trả về thông báo lỗi
            res.status(500).json({
                message: 'Something went wrong',
                error: error.message,
            })
        }
    }
    async approvedPendingPost(req, res) {
        const { postId } = req.params
        try {
            const post = await Post.findOne({
                where: { postId },
            })
            post.state = 'approved'
            await post.save()
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    async rejectPendingPost(req, res) {
        const { postId } = req.params
        const { reason } = req.body
        try {
            const post = await Post.findOne({
                where: { postId },
            })
            post.state = 'hidden'
            post.hiddenReason = reason
            await post.save()
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    async getAllComment(req, res) {
        try {
            const sortDirection = req.query.sort || 'DESC'
            const { filter } = req.params
            const page = parseInt(req.query.page) || 1
            const pageSize = parseInt(req.query.pageSize) || 10

            let bookComments = []
            let postComments = []
            let totalCount = 0

            if (filter === 'all' || filter === 'book-cmt') {
                const { count, rows } = await BookComment.findAndCountAll({
                    where: {
                        status: true, // Chỉ lấy bình luận có status = true
                    },
                    attributes: [
                        'commentId',
                        'comment',
                        'bookId',
                        'userId',
                        'createdAt',
                        'status',
                        [sequelize.literal("'book'"), 'type'],
                    ],
                    include: [
                        {
                            model: Book,
                            as: 'book',
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['avatar', 'firstname', 'lastname'],
                        },
                    ],
                    order: [['createdAt', sortDirection]],
                })
                bookComments = rows
                totalCount += count
            }

            if (filter === 'all' || filter === 'post-cmt') {
                const { count, rows } = await PostComment.findAndCountAll({
                    where: {
                        status: true, // Chỉ lấy bình luận có status = true
                    },
                    attributes: [
                        'commentId',
                        'content',
                        'postId',
                        'userId',
                        'createdAt',
                        'status',
                        [sequelize.literal("'post'"), 'type'],
                    ],
                    include: [
                        {
                            model: Post,
                            as: 'post',
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['avatar', 'firstname', 'lastname'],
                        },
                    ],
                    order: [['createdAt', sortDirection]],
                })
                postComments = rows
                totalCount += count
            }

            const allComments = [...bookComments, ...postComments]
            allComments.sort((a, b) =>
                sortDirection === 'DESC'
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt)
            )

            // Phân trang thủ công sau khi gộp
            const start = (page - 1) * pageSize
            const end = start + pageSize
            const paginatedComments = allComments.slice(start, end)

            res.status(200).json({
                totalCount,
                page,
                pageSize,
                allComments: paginatedComments,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Lỗi khi lấy danh sách bình luận.',
                error,
            })
        }
    }
    async getHiddenComment(req, res) {
        try {
            const sortDirection = req.query.sort || 'DESC'
            const { filter } = req.params
            const page = parseInt(req.query.page) || 1
            const pageSize = parseInt(req.query.pageSize) || 10

            let bookComments = []
            let postComments = []
            let totalCount = 0

            if (filter === 'all' || filter === 'book-cmt') {
                const { count, rows } = await BookComment.findAndCountAll({
                    where: {
                        status: false, // Chỉ lấy bình luận có status = false
                    },
                    attributes: [
                        'commentId',
                        'comment',
                        'bookId',
                        'userId',
                        'createdAt',
                        'status',
                        [sequelize.literal("'book'"), 'type'],
                    ],
                    include: [
                        {
                            model: Book,
                            as: 'book',
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['avatar', 'firstname', 'lastname'],
                        },
                    ],
                    order: [['createdAt', sortDirection]],
                })
                bookComments = rows
                totalCount += count
            }

            if (filter === 'all' || filter === 'post-cmt') {
                const { count, rows } = await PostComment.findAndCountAll({
                    where: {
                        status: false, // Chỉ lấy bình luận có status = false
                    },
                    attributes: [
                        'commentId',
                        'content',
                        'postId',
                        'userId',
                        'createdAt',
                        'status',
                        [sequelize.literal("'post'"), 'type'],
                    ],
                    include: [
                        {
                            model: Post,
                            as: 'post',
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['avatar', 'firstname', 'lastname'],
                        },
                    ],
                    order: [['createdAt', sortDirection]],
                })
                postComments = rows
                totalCount += count
            }

            const allComments = [...bookComments, ...postComments]
            allComments.sort((a, b) =>
                sortDirection === 'DESC'
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt)
            )

            // Phân trang thủ công sau khi gộp
            const start = (page - 1) * pageSize
            const end = start + pageSize
            const paginatedComments = allComments.slice(start, end)

            res.status(200).json({
                totalCount,
                page,
                pageSize,
                allComments: paginatedComments,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Lỗi khi lấy danh sách bình luận.',
                error,
            })
        }
    }
}

export default new adminController()
