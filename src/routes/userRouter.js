import express from 'express'
const router = express.Router()
import authController from '../app/controllers/authController.js'

// Tạo người dùng
router.post('/register', authController.createUser)

// Đăng nhập
router.post('/login', authController.login)

// Endpoint làm mới Access Token
router.post('/token/refresh', authController.refreshToken)

// Logout
router.post('/logout', authController.logout)

export default router
