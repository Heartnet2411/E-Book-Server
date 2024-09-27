import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User, RefreshToken } from '../models/index.js'
import { generateRandomHexId } from '../../utils/index.js'

// Tạo Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.userId, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    )
}

// Tạo Refresh Token
const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        { userId: user.userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    )

    if (typeof refreshToken !== 'string') {
        throw new Error('Token must be a string')
    }

    // Kiểm tra nếu user đã có refresh token
    const existingToken = await RefreshToken.findOne({
        where: { userId: user.userId },
    })
    if (existingToken) {
        // Xóa token cũ
        await RefreshToken.destroy({ where: { userId: user.userId } })
    }

    // Lưu Refresh Token vào cơ sở dữ liệu
    const createdRefreshToken = await RefreshToken.create({
        id: `token_${Date.now()}`,
        userId: user.userId,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return refreshToken
}

class authController {
    // Đăng nhập
    login = async (req, res) => {
        const { email, password } = req.body

        try {
            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res
                    .status(400)
                    .json({ message: 'Không tìm thấy người dùng' })
            }

            // Kiểm tra mật khẩu
            const isPasswordValid = await bcrypt.compare(
                password.trim(),
                user.password
            )
            console.log(password)
            console.log(user.password)
            console.log(isPasswordValid)

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Mật khẩu không đúng' })
            }

            // Tạo Access Token và Refresh Token
            const accessToken = generateAccessToken(user)
            const refreshToken = await generateRefreshToken(user)

            res.status(200).json({
                message: 'Login successfull',
                accessToken,
                refreshToken,
            })
        } catch (error) {
            res.status(500).json({ message: 'Login failed', error })
        }
    }
    //đăng ký
    createUser = async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body

            const user = await User.findOne({ where: { email } })

            if (user) {
                return res
                    .status(400)
                    .json({ message: 'Người dùng đã được đăng ký' })
            }

            //tạo id với 1 mã hex ngẫu nhiên
            const userID = generateRandomHexId(16)
            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10) // 10 là số lần băm

            // Tạo User với mật khẩu đã mã hóa
            const newUser = await User.create({
                userId: userID,
                firstName,
                lastName,
                email,
                password: hashedPassword, // Lưu mật khẩu đã mã hóa
            })

            // Tạo Refresh Token
            const refreshToken = generateRefreshToken(newUser)

            // Tạo Access Token
            const accessToken = generateAccessToken(newUser)

            res.status(201).json({
                message: 'Register successfull',
                user: newUser,
                accessToken,
                refreshToken,
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Refresh token để tạo Access Token mới
    refreshToken = async (req, res) => {
        const { token } = req.body

        if (!token) {
            return res
                .status(401)
                .json({ message: 'Refresh token is required' })
        }

        try {
            // Xác minh refresh token
            const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

            // Kiểm tra token trong cơ sở dữ liệu
            const storedToken = await RefreshToken.findOne({ where: { token } })

            if (!storedToken) {
                return res
                    .status(403)
                    .json({ message: 'Invalid refresh token' })
            }

            // Tạo Access Token mới
            const user = await User.findByPk(payload.userId)
            const accessToken = generateAccessToken(user)

            res.status(200).json({
                accessToken,
            })
        } catch (error) {
            res.status(403).json({ message: 'Invalid refresh token', error })
        }
    }

    // Hàm logout
    logout = async (req, res) => {
        const { token } = req.body

        if (!token) {
            return res
                .status(400)
                .json({ message: 'Refresh token is required' })
        }

        try {
            // Xóa Refresh Token khỏi cơ sở dữ liệu
            const result = await RefreshToken.destroy({
                where: { token },
            })

            // Kiểm tra xem token có được xóa không
            if (result === 0) {
                return res
                    .status(404)
                    .json({ message: 'Refresh token not found' })
            }

            res.status(200).json({ message: 'Logout successfully' })
        } catch (error) {
            res.status(500).json({ message: 'Logout failed', error })
        }
    }
}

export default new authController()
