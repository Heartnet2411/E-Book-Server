import jwt from 'jsonwebtoken'

// Middleware để xác thực Access Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Lấy token từ header

    if (!token) {
        return res.sendStatus(401) // Unauthorized
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403) // Forbidden
        }
        req.user = user // Lưu thông tin người dùng vào req.user
        next() // Tiếp tục đến route tiếp theo
    })
}

export default authenticateToken
