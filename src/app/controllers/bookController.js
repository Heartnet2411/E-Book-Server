import { Book, Category } from '../models/index.js'
import { Op } from 'sequelize'

class BookController {
    // Tạo mới một cuốn sách
    async createBook(req, res) {
        try {
            q
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

    // Tìm sách theo nhiều điều kiện
    async searchBooks(req, res) {
        try {
            const {
                name,
                page = 1,
                country,
                startYear,
                endYear,
                categoryId,
            } = req.query
            const limit = 10 // Giới hạn 10 sách mỗi trang
            const offset = (page - 1) * limit // Tính vị trí bắt đầu

            const where = {}

            // Thêm điều kiện tìm kiếm nếu có từ khóa
            if (name) {
                where[Op.or] = [
                    { bookName: { [Op.like]: `%${name}%` } },
                    { author: { [Op.like]: `%${name}%` } },
                ]
            }

            // Thêm điều kiện tìm kiếm theo quốc gia nếu có
            if (country) {
                where.country = { [Op.like]: `%${country}%` } // Tìm kiếm theo quốc gia (có thể là một phần)
            }

            // Thêm điều kiện tìm kiếm theo khoảng năm nếu có
            if (startYear && endYear) {
                const startDate = new Date(`${startYear}-01-01`)
                const endDate = new Date(`${endYear}-12-31`)
                where.releaseDate = {
                    [Op.between]: [startDate, endDate], // Tìm sách có ngày xuất bản trong khoảng đã cho
                }
            } else if (startYear) {
                const startDate = new Date(`${startYear}-01-01`)
                where.releaseDate = {
                    [Op.gte]: startDate, // Tìm sách có ngày xuất bản từ năm bắt đầu trở về sau
                }
            } else if (endYear) {
                const endDate = new Date(`${endYear}-12-31`)
                where.releaseDate = {
                    [Op.lte]: endDate, // Tìm sách có ngày xuất bản trước năm kết thúc
                }
            }

            // Xây dựng các điều kiện include cho Category
            const include = [
                {
                    model: Category,
                    as: 'categories',
                    attributes: ['categoryId', 'name'],
                    ...(categoryId ? { where: { categoryId } } : {}), // Thêm điều kiện where nếu có categoryId
                },
            ]

            // Đếm tổng số sách thỏa mãn điều kiện với include
            const totalBooks = await Book.count({
                where,
                include,
                distinct: true, // Đảm bảo chỉ đếm các sách duy nhất
            })

            // Tìm các sách với phân trang và include
            const books = await Book.findAll({
                where,
                include,
                limit,
                offset,
            })

            // Tính tổng số trang dựa trên tổng số sách
            const totalPages = Math.ceil(totalBooks / limit)

            res.status(200).json({
                books,
                totalBooks,
                totalPages,
                currentPage: parseInt(page),
                limit,
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new BookController()
