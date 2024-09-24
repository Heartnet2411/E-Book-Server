import express from 'express'
const router = express.Router()
import authController from '../app/controllers/authController.js'

// Endpoint tạo người dùng
router.post('/register', authController.createUser)

// Endpoint đăng nhập
router.post('/login', authController.login)

// Endpoint làm mới Access Token
router.post('/token/refresh', authController.refreshToken)

export default router
