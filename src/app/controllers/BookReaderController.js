import { BookReader } from '../models/index.js'

class BookReaderController {
    async userReader(req, res) {
        const bookId = req.params.bookId
        const userId = req.user.userId

        try {
            // Tìm bản ghi dựa trên userId và bookId
            let bookReader = await BookReader.findOne({
                where: { userId, bookId },
            })

            if (bookReader) {
                // Nếu bản ghi đã tồn tại, tăng readCount lên 1
                bookReader.readCount += 1
                await bookReader.save()
            } else {
                // Nếu chưa có, tạo mới với readCount = 1
                bookReader = await BookReader.create({
                    userId,
                    bookId,
                    readCount: 1,
                })
            }

            res.status(200).json(bookReader)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new BookReaderController()
