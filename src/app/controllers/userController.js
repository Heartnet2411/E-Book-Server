import { User } from '../models/index.js'
import bcrypt from 'bcryptjs'

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
            const userId = req.user.userId // Lấy ID của user từ URL
            const { gender, firstName, lastName, dateOfBirth, phoneNumber } =
                req.body // Lấy dữ liệu từ body

            // Kiểm tra xem user có tồn tại hay không
            const user = await User.findByPk(userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Cập nhật thông tin
            user.gender =
                gender !== undefined ? Boolean(Number(gender)) : user.gender
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

    async uploadAvatar(req, res) {
        try {
            const avatarUrl = req.imageUrl || null

            // Lấy ID người dùng từ token
            const userId = req.user.userId

            // Cập nhật avatar cho người dùng trong cơ sở dữ liệu
            const user = await User.findByPk(userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Cập nhật avatar của người dùng
            user.avatar = avatarUrl
            await user.save()

            // Trả về kết quả thành công
            return res
                .status(200)
                .json({ message: 'Avatar uploaded successfully', avatarUrl })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    }

    async uploadBackground(req, res) {
        try {
            const backgroundUrl = req.imageUrl || null

            // Lấy ID người dùng từ token
            const userId = req.user.userId

            // Cập nhật ảnh bìa cho người dùng trong cơ sở dữ liệu
            const user = await User.findByPk(userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            // Cập nhật ảnh bìa của người dùng
            user.background = backgroundUrl
            await user.save()

            // Trả về kết quả thành công
            return res.status(200).json({
                message: 'Background image uploaded successfully',
                backgroundUrl,
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Server error' })
        }
    }

    async changePassword(req, res) {
        try {
            const userId = req.user.userId // Lấy userId từ token
            const { currentPassword, newPassword } = req.body // Lấy dữ liệu từ body

            // Kiểm tra dữ liệu đầu vào
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    message: 'Vui lòng nhập đầy đủ thông tin.',
                })
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({
                    message:
                        'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 số.',
                })
            }

            // Lấy thông tin người dùng từ cơ sở dữ liệu
            const user = await User.findByPk(userId)
            if (!user) {
                return res.status(404).json({ message: 'Lỗi xác thực' })
            }

            // Kiểm tra mật khẩu hiện tại
            const isPasswordValid = await bcrypt.compare(
                currentPassword,
                user.password
            )
            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ message: 'Mật khẩu hiện tại không đúng.' })
            }

            // Hash mật khẩu mới
            const hashedNewPassword = await bcrypt.hash(newPassword, 10)

            // Cập nhật mật khẩu mới
            user.password = hashedNewPassword
            await user.save()

            res.status(200).json({ message: 'Password updated successfully.' })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Failed to change password.',
                error: error.message,
            })
        }
    }
}

export default new UserController()
