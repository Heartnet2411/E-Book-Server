import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { app } from '../utils/firebase.js'

export const uploadImageToFirebase = async (req, res, next) => {
    try {
        const storage = getStorage(app)
        const image = req.file // Giả sử file được gửi qua request

        // Nếu không có ảnh thì bỏ qua bước upload và chuyển sang bước tiếp theo
        if (!image) {
            req.imageUrl = null // Đặt giá trị null cho imageUrl nếu không có ảnh
            return next() // Tiếp tục đến hàm xử lý tiếp theo
        }

        const storageRef = ref(
            storage,
            `post/${Date.now()}_${image.originalname}`
        )
        await uploadBytes(storageRef, image.buffer)
        const imageUrl = await getDownloadURL(storageRef)

        req.imageUrl = imageUrl // Gán URL của ảnh vào req để sử dụng sau
        next() // Tiếp tục đến hàm xử lý tiếp theo
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' })
    }
}
