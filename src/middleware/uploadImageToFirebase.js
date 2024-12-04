import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { app } from '../utils/firebase.js'

import axios from 'axios'

const storage = getStorage(app)

export const uploadImageFromUrl = async (req, res, next) => {
    try {
        const imageUrl = req.body.imageUrl // URL hình ảnh từ client
        if (!imageUrl) {
            return res.status(400).json({ message: 'Image URL is required' })
        }

        // Tải ảnh từ URL
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        })

        // Tạo tên file duy nhất
        const fileName = `images/${Date.now()}_${imageUrl.split('/').pop()}`

        // Upload dữ liệu lên Firebase Storage
        const storageRef = ref(storage, fileName)
        const metadata = {
            contentType: response.headers['content-type'], // Loại file
        }
        await uploadBytes(storageRef, Buffer.from(response.data), metadata)

        // Lấy URL truy cập file
        const downloadUrl = await getDownloadURL(storageRef)

        req.imageUrl = downloadUrl
        next()
    } catch (error) {
        console.error('Error uploading image:', error)
        return res.status(500).json({ message: 'Error uploading image' })
    }
}

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
