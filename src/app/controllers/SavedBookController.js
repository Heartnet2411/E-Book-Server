import BookSaved from '../models/BookSaved.js'
import Book from '../models/Book.js'

class SavedBookController {
    // Hàm để lưu sách
    saveBook = async (req, res) => {
        const { bookId } = req.body
        const userId = req.user.userId // Lấy userId từ token

        try {
            const existingRecord = await BookSaved.findOne({
                where: { userId, bookId },
            })
            if (existingRecord) {
                return res
                    .status(400)
                    .json({ message: 'Sách đã được lưu trước đó.' })
            }

            const bookSaved = await BookSaved.create({ userId, bookId })
            res.status(201).json({
                message: 'Sách đã được lưu thành công.',
                bookSaved,
            })
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi lưu sách.' })
        }
    }

    // Hàm để bỏ lưu sách
    unsaveBook = async (req, res) => {
        const { bookId } = req.body
        const userId = req.user.userId // Lấy userId từ token

        try {
            const deletedRecord = await BookSaved.destroy({
                where: { userId, bookId },
            })

            if (!deletedRecord) {
                return res
                    .status(404)
                    .json({ message: 'Sách không được lưu trước đó.' })
            }

            res.status(200).json({ message: 'Đã bỏ lưu sách thành công.' })
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi bỏ lưu sách.' })
        }
    }

    // Hàm để lấy sách đã lưu của người dùng
    getSavedBooks = async (req, res) => {
        const userId = req.user.userId // Lấy userId từ token

        try {
            const savedBooks = await BookSaved.findAll({
                where: { userId },
                include: [
                    {
                        model: Book,
                        required: true,
                    },
                ],
            })

            res.status(200).json(savedBooks)
        } catch (error) {
            res.status(500).json({
                error: 'Có lỗi xảy ra khi lấy sách đã lưu.',
            })
        }
    }

    isBookSaved = async (req, res) => {
        const { bookId } = req.params // Lấy bookId từ tham số URL
        const userId = req.user.userId // Lấy userId từ token

        try {
            const existingRecord = await BookSaved.findOne({
                where: { userId, bookId },
            })

            if (existingRecord) {
                return res.status(200).json({ isSaved: true })
            } else {
                return res.status(200).json({ isSaved: false })
            }
        } catch (error) {
            res.status(500).json({
                error: 'Có lỗi xảy ra khi kiểm tra lưu sách.',
            })
        }
    }
}

export default new SavedBookController()
