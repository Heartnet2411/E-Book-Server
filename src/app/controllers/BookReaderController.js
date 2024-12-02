import { BookReader, Book, BookSaved } from '../models/index.js'
import { startOfWeek, endOfWeek } from 'date-fns'
import sequelize from '../../connection/connection.js'
import { Op } from 'sequelize'

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

    async getBookReadStats(req, res) {
        try {
            // Xác định ngày bắt đầu và kết thúc tuần hiện tại
            const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }) // Thứ Hai
            const endDate = endOfWeek(new Date(), { weekStartsOn: 1 }) // Chủ Nhật

            // Lấy danh sách tất cả sách
            const allBooks = await Book.findAll({
                attributes: ['bookId', 'bookName', 'author', 'imageUrl'],
            })

            // Thêm thống kê cho từng sách
            const booksWithStats = await Promise.all(
                allBooks.map(async (book) => {
                    // Tổng lượt đọc toàn bộ thời gian
                    const totalReadCount = await BookReader.sum('readCount', {
                        where: { bookId: book.bookId },
                    })

                    // Tổng lượt đọc trong tuần hiện tại
                    const weeklyReadCount = await BookReader.sum('readCount', {
                        where: {
                            bookId: book.bookId,
                            createdAt: {
                                [Op.between]: [startDate, endDate],
                            },
                        },
                    })

                    // Tổng số lượt lưu sách
                    const totalSavedCount = await BookSaved.count({
                        where: { bookId: book.bookId },
                    })

                    return {
                        book,
                        totalReadCount: totalReadCount || 0, // Nếu không có thì trả về 0
                        weeklyReadCount: weeklyReadCount || 0, // Nếu không có thì trả về 0
                        totalSavedCount, // Tổng lượt lưu sách
                    }
                })
            )

            // Trả về kết quả
            res.status(200).json({
                message:
                    'Danh sách tất cả sách với thống kê lượt đọc và lưu sách.',
                books: booksWithStats,
            })
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sách với thống kê:', error)
            res.status(500).json({
                message: 'Lỗi khi lấy danh sách sách với thống kê.',
                error: error.message,
            })
        }
    }
}

export default new BookReaderController()
