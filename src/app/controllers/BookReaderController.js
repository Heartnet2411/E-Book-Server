import { BookReader } from '../models/index.js'

class BookReaderController {
    async recordBookReading(req, res) {
        const { bookId } = req.params
        const userId = req.user.userId // Giả sử userId được lấy từ token middleware

        try {
            if (!bookId) {
                return res.status(400).json({
                    message: 'bookId là bắt buộc.',
                })
            }

            // Kiểm tra xem bản ghi đã tồn tại cho tuần này hay chưa
            const currentDate = new Date()
            const startOfWeekDate = new Date(
                currentDate.setDate(
                    currentDate.getDate() - currentDate.getDay() + 1
                )
            ) // Thứ Hai tuần hiện tại
            startOfWeekDate.setHours(0, 0, 0, 0)

            const endOfWeekDate = new Date(
                currentDate.setDate(
                    currentDate.getDate() - currentDate.getDay() + 7
                )
            ) // Chủ Nhật tuần hiện tại
            endOfWeekDate.setHours(23, 59, 59, 999)

            const existingRecord = await BookReader.findOne({
                where: {
                    userId,
                    bookId,
                    createdAt: {
                        $between: [startOfWeekDate, endOfWeekDate], // Chỉ kiểm tra trong tuần hiện tại
                    },
                },
            })

            if (existingRecord) {
                // Nếu đã có bản ghi, tăng `readCount` lên 1
                existingRecord.readCount += 1
                await existingRecord.save()

                return res.status(200).json({
                    message: 'Đã cập nhật số lần đọc của sách.',
                    bookId,
                    userId,
                    readCount: existingRecord.readCount,
                })
            }

            // Nếu chưa có bản ghi, tạo một bản ghi mới
            const newRecord = await BookReader.create({
                userId,
                bookId,
                readCount: 1,
            })

            res.status(201).json({
                message: 'Đã ghi lại lần đọc đầu tiên của sách.',
                bookId,
                userId,
                readCount: newRecord.readCount,
            })
        } catch (error) {
            console.error('Lỗi khi ghi lại sách đã đọc:', error)
            res.status(500).json({
                message: 'Lỗi khi ghi lại sách đã đọc.',
                error: error.message,
            })
        }
    }
}

export default new BookReaderController()
