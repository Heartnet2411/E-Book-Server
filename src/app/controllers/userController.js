import { User } from '../models/index.js'

class UserController {
    async getUserByID(req, res) {
        try {
            const { id } = req.params // Lấy id từ tham số URL

            // Tìm người dùng theo id và bao gồm luôn thông tin role
            const user = await User.findOne({
                where: { userId: id },
                include: 'role', // Bao gồm thông tin role của user
            })

            // Nếu không tìm thấy người dùng
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Trả về thông tin người dùng
            res.status(200).json(user)
        } catch (error) {
            // Xử lý lỗi và trả về thông báo lỗi
            res.status(500).json({
                message: 'Something went wrong',
                error: error.message,
            })
        }
    }

    //update user info
    async updateUserInfo(req, res) {
        try {
            const { id } = req.params // Lấy ID của user từ URL
            const { gender, firstName, lastName, dateOfBirth, phoneNumber } =
                req.body // Lấy dữ liệu từ body

            // Kiểm tra xem user có tồn tại hay không
            const user = await User.findByPk(id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Cập nhật thông tin
            user.gender = gender || user.gender
            user.firstName = firstName || user.firstName
            user.lastName = lastName || user.lastName
            user.dateOfBirth = dateOfBirth || user.dateOfBirth
            user.phoneNumber = phoneNumber || user.phoneNumber

            // Lưu thay đổi
            await user.save()

            res.status(200).json({ message: 'User updated successfully', user })
        } catch (error) {
            res.status(500).json({
                message: 'Failed to update user',
                error: error.message,
            })
        }
    }
}

export default new UserController()
