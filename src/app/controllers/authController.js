import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User, RefreshToken, Role } from '../models/index.js'
import { generateRandomHexId } from '../../utils/index.js'

// Tạo Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.userId, email: user.email, role: user.role.roleName },
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
            const user = await User.findOne({
                where: { email },
                include: 'role',
            })

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
                user,
            })
        } catch (error) {
            res.status(500).json({ message: 'Login failed', error })
        }
    }

    //đăng ký
    createUser = async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body

            const image = req.imageUrl

            if (!firstName || !lastName || !email) {
                return res
                    .status(400)
                    .json({ message: 'Require valid user info' })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res
                    .status(400)
                    .json({ message: 'Invalid email address' })
            }
            const user = await User.findOne({ where: { email } })

            if (user) {
                return res
                    .status(400)
                    .json({ message: 'Người dùng đã được đăng ký' })
            }

            //tạo id với 1 mã hex ngẫu nhiên
            const userID = generateRandomHexId(16)
            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10)
            const role = await Role.findOne({ where: { roleName: 'User' } })

            var avatar

            if (image === null)
                avatar =
                    'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2Fistockphoto-1300845620-612x612.jpg?alt=media&token=d7429bf3-7711-4490-84ea-cf467ca2eb16'
            else avatar = image

            // Tạo User với mật khẩu đã mã hóa
            const newUser = await User.create({
                userId: userID,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                avatar: avatar,
                background:
                    'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2Fc%C3%A1p%20quang_%20(1).jpg?alt=media&token=2347a70b-73e9-4a6c-bed2-8a6040f1bd04',
                roleId: role.roleId,
            })

            // Nạp lại user với role để đảm bảo 'role' được bao gồm
            const userWithRole = await User.findOne({
                where: { userID },
                include: 'role',
            })

            res.status(201).json({
                user: userWithRole,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }

    // Refresh token để tạo Access Token mới
    refreshToken = async (req, res) => {
        const { token } = req.body
        console.log('tokem', token)

        if (!token) {
            return res
                .status(401)
                .json({ message: 'Refresh token is required' })
        }

        try {
            // Xác minh refresh token
            const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

            // Kiểm tra token trong cơ sở dữ liệu
            const storedToken = await RefreshToken.findOne({
                where: { token },
                include: {
                    model: User,
                    include: [
                        {
                            model: Role,
                            as: 'role',
                        },
                    ],
                },
            })

            console.log(storedToken)

            if (!storedToken) {
                return res
                    .status(403)
                    .json({ message: 'Invalid refresh token' })
            }

            // Kiểm tra xem token đã hết hạn chưa
            if (new Date() > storedToken.expires_at) {
                // Xóa token đã hết hạn
                await RefreshToken.destroy({ where: { token } })
                return res
                    .status(403)
                    .json({ message: 'Refresh token has expired' })
            }

            // Tạo Access Token mới
            const user = storedToken.User
            const accessToken = generateAccessToken(user)

            res.status(200).json({
                accessToken,
            })
        } catch (error) {
            console.log(error)
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
