import express from 'express'
import userController from '../app/controllers/UserController.js'
import authenticateToken from '../middleware/authenticateToken.js'
import { uploadImageToFirebase } from '../middleware/uploadImageToFirebase.js'
import multer from 'multer'

const storage = multer.memoryStorage() // Lưu trữ file trong bộ nhớ
const upload = multer({ storage: storage })

// Middleware để xử lý file upload
const uploadImage = upload.single('file') // 'image' là tên của field trong FormData

const router = express.Router()

router.get('/:id', userController.getUserByID)

router.put('/update-userinfo', authenticateToken, userController.updateUserInfo)

router.post(
    '/upload/avatar',
    authenticateToken,
    uploadImage, // Sử dụng multer để xử lý file
    uploadImageToFirebase, // Sau đó upload lên Firebase
    userController.uploadAvatar
)

router.post(
    '/upload/background',
    authenticateToken,
    uploadImage, // Sử dụng multer để xử lý file
    uploadImageToFirebase, // Sau đó upload lên Firebase
    userController.uploadBackground
)

router.post(
    '/change-password',
    authenticateToken,
    userController.changePassword
)

export default router
