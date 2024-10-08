import jwt from 'jsonwebtoken'
import { User, Role } from '../app/models/index.js'

const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Lấy token từ header

    if (!token) {
        return res.status(401).json({ message: 'Access token is required' })
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // Tìm người dùng dựa trên payload
        const user = await User.findByPk(payload.userId, { include: 'role' })

        if (!user) {
            return res.status(403).json({ message: 'User not found' })
        }

        // Kiểm tra vai trò của người dùng
        if (user.role.roleName !== 'Admin') {
            return res
                .status(403)
                .json({ message: 'Access denied: Admins only' })
        }

        // Lưu thông tin người dùng vào req.user để sử dụng trong các middleware tiếp theo
        req.user = user
        next() // Tiếp tục đến route tiếp theo
    } catch (error) {
        console.error('Error in authenticateAdmin middleware:', error)
        return res.status(403).json({ message: 'Invalid or expired token' })
    }
}

export default authenticateAdmin
