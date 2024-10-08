import { User, Role } from '../models/index.js'

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
}

export default new adminController()
