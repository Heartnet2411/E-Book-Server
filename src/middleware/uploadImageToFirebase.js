import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { app } from '../utils/firebase.js'

export const uploadImageToFirebase = async (req, res, next) => {
    try {
        const storage = getStorage(app)
        const image = req.file // Giả sử file được gửi qua request

        if (!image) {
            return res.status(400).json({ message: 'No image file provided' })
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
