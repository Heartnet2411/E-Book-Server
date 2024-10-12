import { Book, Category } from '../models/index.js'

class BookController {
    // Tạo mới một cuốn sách
    async createBook(req, res) {
        try {
            const {
                isbn,
                bookName,
                author,
                country,
                publisher,
                releaseDate,
                description,
                epubUrl,
                imageUrl,
                categoryIds,
            } = req.body

            // Tạo mới cuốn sách
            const newBook = await Book.create({
                isbn,
                bookName,
                author,
                country,
                publisher,
                releaseDate,
                description,
                epubUrl,
                imageUrl,
            })

            // Liên kết cuốn sách với các thể loại
            if (categoryIds && categoryIds.length > 0) {
                await newBook.addCategories(categoryIds) // Sử dụng hàm auto-generated để liên kết
            }

            res.status(201).json(newBook)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Lấy tất cả các cuốn sách
    async getAllBooks(req, res) {
        try {
            const books = await Book.findAll({
                include: [
                    {
                        model: Category,
                        as: 'categories',
                    },
                ], // Bao gồm thông tin category
            })
            res.status(200).json(books)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Lấy thông tin cuốn sách theo ID
    async getBookById(req, res) {
        try {
            const { bookId } = req.params
            const book = await Book.findByPk(bookId, {
                include: [
                    {
                        model: Category,
                        as: 'categories',
                    },
                ],
            })

            if (!book) {
                return res.status(404).json({ message: 'Book not found' })
            }

            res.status(200).json(book)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Cập nhật thông tin cuốn sách
    async updateBook(req, res) {
        try {
            const { bookId } = req.params
            const {
                isbn,
                categoryId,
                bookName,
                author,
                country,
                publisher,
                releaseDate,
                description,
                epubUrl,
                imageUrl,
            } = req.body

            const book = await Book.findByPk(bookId)
            if (!book) {
                return res.status(404).json({ message: 'Book not found' })
            }

            await book.update({
                isbn,
                categoryId,
                bookName,
                author,
                country,
                publisher,
                releaseDate,
                description,
                epubUrl,
                imageUrl,
            })
            res.status(200).json(book)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Xóa cuốn sách
    async deleteBook(req, res) {
        try {
            const { bookId } = req.params
            const book = await Book.findByPk(bookId)
            if (!book) {
                return res.status(404).json({ message: 'Book not found' })
            }

            await book.destroy()
            res.status(200).json({ message: 'Book deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new BookController()
