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
                countries, // Chấp nhận nhiều quốc gia dưới dạng chuỗi phân tách bằng dấu phẩy
                startYear,
                endYear,
                categoryIds,
            } = req.query
            const limit = 10
            const offset = (page - 1) * limit

            const where = {}

            // Thêm điều kiện tìm kiếm theo từ khóa
            if (name) {
                where[Op.or] = [
                    { bookName: { [Op.like]: `%${name}%` } },
                    { author: { [Op.like]: `%${name}%` } },
                ]
            }

            // Thêm điều kiện tìm kiếm theo nhiều quốc gia
            if (countries) {
                where.country = {
                    [Op.in]: countries
                        .split(',')
                        .map((country) => country.trim()),
                }
            }

            // Thêm điều kiện tìm kiếm theo khoảng năm
            if (startYear && endYear) {
                where.releaseDate = {
                    [Op.between]: [
                        new Date(`${startYear}-01-01`),
                        new Date(`${endYear}-12-31`),
                    ],
                }
            } else if (startYear) {
                where.releaseDate = { [Op.gte]: new Date(`${startYear}-01-01`) }
            } else if (endYear) {
                where.releaseDate = { [Op.lte]: new Date(`${endYear}-12-31`) }
            }

            // Kiểm tra nếu có nhiều categoryId và xử lý nó
            const include = [
                {
                    model: Category,
                    as: 'categories',
                    attributes: ['categoryId', 'name'],
                    where: categoryIds
                        ? { categoryId: { [Op.in]: categoryIds.split(',') } }
                        : undefined,
                },
            ]

            // Đếm tổng số sách thỏa mãn điều kiện với include
            const totalBooks = await Book.count({
                where,
                include,
                distinct: true,
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
                currentPage: parseInt(page, 10),
                limit,
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new BookController()
