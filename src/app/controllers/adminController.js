import { User, Role, Post, BookComment, PostComment } from '../models/index.js'

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
            // Lấy các tham số phân trang và sắp xếp từ query
            // const limit = parseInt(req.query.limit) || 10 // Số bản ghi mỗi trang, mặc định là 10
            // const page = parseInt(req.query.page) || 1 // Trang hiện tại, mặc định là 1
            // const offset = (page - 1) * limit // Tính toán offset
            const sortDirection = req.query.sort || 'DESC' // Hướng sắp xếp: ASC hoặc DESC

            // Lấy bình luận sách
            const bookComments = await BookComment.findAll({
                attributes: [
                    'id',
                    'content',
                    'bookId',
                    'userId',
                    'createdAt',
                    [sequelize.literal("'book'"), 'type'],
                ],
                // offset,
                // limit,
                order: [['createdAt', sortDirection]],
            })

            // Lấy bình luận bài viết
            const postComments = await PostComment.findAll({
                attributes: [
                    'id',
                    'content',
                    'postId',
                    'userId',
                    'createdAt',
                    [sequelize.literal("'post'"), 'type'],
                ],
                // offset,
                // limit,
                order: [['createdAt', sortDirection]],
            })

            // Gộp dữ liệu
            const allComments = [...bookComments, ...postComments]

            // Sắp xếp theo thời gian tạo
            allComments.sort((a, b) => {
                const timeA = new Date(a.createdAt)
                const timeB = new Date(b.createdAt)
                return sortDirection === 'DESC' ? timeB - timeA : timeA - timeB
            })

            // Trả về kết quả
            res.status(200).json({
                // total: allComments.length,
                // page,
                // limit,
                // data: allComments,
                allComments
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
