// routes/postRoutes.js
import express from 'express'
import PostController from '../app/controllers/PostController.js'
import authenticateToken from '../middleware/authenticateToken.js'
import { uploadImageToFirebase } from '../middleware/uploadImageToFirebase.js'
import multer from 'multer'
import authenticateAdmin from '../middleware/authenticateAdmin.js'

const storage = multer.memoryStorage() // Lưu trữ file trong bộ nhớ
const upload = multer({ storage: storage })

// Middleware để xử lý file upload
const uploadImage = upload.single('image') // 'image' là tên của field trong FormData

const router = express.Router()

router.get('/', PostController.getAllPosts)

router.post(
    '/',
    authenticateToken,
    uploadImage, // Sử dụng multer để xử lý file
    uploadImageToFirebase, // Sau đó upload lên Firebase
    PostController.createPost
)

router.get('/:userId', PostController.getPostsByUserId)

router.get('/topic/:topicId', PostController.getPostsByTopicId)

router.put('/:postId', authenticateToken, PostController.updatePost)

router.delete('/:postId', authenticateToken, PostController.deletePost)

router.get('/list/:filter', authenticateAdmin, PostController.getPostsByState)

export default router
