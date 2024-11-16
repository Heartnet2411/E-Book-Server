import { Op } from 'sequelize'
import { Book, Category, BookSaved, BookComment } from '../models/index.js'

class RecommendBookController {
    async recommendBooks(req, res) {
        const userId = req.user.userId

        try {
            // Lấy danh sách sách đã lưu của người dùng
            const savedBooks = await BookSaved.findAll({
                where: { userId },
                include: {
                    model: Book,
                    required: true,
                    include: [
                        {
                            model: Category,
                            as: 'categories',
                        },
                    ],
                    attributes: ['bookId', 'bookName', 'author', 'country'],
                },
            })

            // Lấy danh sách sách mà người dùng đã đánh giá cao (rating >= 4)
            const likedBooks = await BookComment.findAll({
                where: {
                    userId,
                    rating: { [Op.gte]: 4 },
                },
                include: {
                    model: Book,
                    as: 'book',
                    include: [
                        {
                            model: Category,
                            as: 'categories',
                        },
                    ],
                    attributes: ['bookId', 'bookName', 'author', 'country'],
                },
            })

            // Tạo tập hợp thể loại và quốc gia yêu thích
            const favoriteGenres = new Set()
            const favoriteCountries = new Set()

            // Thêm thể loại và quốc gia yêu thích từ sách đã lưu
            savedBooks.forEach(({ Book: book }) => {
                if (book && book.categories) {
                    book.categories.forEach((category) => {
                        favoriteGenres.add(category.categoryId)
                    })
                }
                if (book && book.country) {
                    favoriteCountries.add(book.country)
                }
            })

            // Thêm thể loại và quốc gia yêu thích từ sách đã thích
            likedBooks.forEach(({ book }) => {
                if (book && book.categories) {
                    book.categories.forEach((category) =>
                        favoriteGenres.add(category.categoryId)
                    )
                }
                if (book && book.country) favoriteCountries.add(book.country)
            })

            console.log(favoriteGenres)
            console.log(favoriteCountries)
            // Lấy sách gợi ý không trùng với sách đã lưu hoặc đã thích
            const recommendations = await Book.findAll({
                where: {
                    [Op.or]: [
                        {
                            '$categories.categoryId$': {
                                [Op.in]: [...favoriteGenres],
                            },
                        },
                        { country: { [Op.in]: [...favoriteCountries] } },
                    ],
                    bookId: {
                        [Op.notIn]: [
                            ...savedBooks
                                .map(({ book }) => book?.bookId)
                                .filter(Boolean),
                            ...likedBooks
                                .map(({ book }) => book?.bookId)
                                .filter(Boolean),
                        ],
                    },
                },
                include: [
                    {
                        model: Category,
                        as: 'categories', // Đảm bảo tên alias trùng với tên alias trong định nghĩa model
                        through: { attributes: [] },
                    },
                ],
                attributes: [
                    'bookId',
                    'bookName',
                    'country',
                    'epubUrl',
                    'imageUrl',
                ],
                limit: 50,
                subQuery: false, // Loại bỏ subquery để tránh lỗi truy vấn phức tạp
            })

            const randomRecommendations = recommendations
                .sort(() => 0.5 - Math.random()) // Sắp xếp ngẫu nhiên mảng
                .slice(0, 15) // Lấy 15 phần tử đầu tiên

            // Trả về danh sách gợi ý
            res.status(200).json(randomRecommendations)
        } catch (error) {
            console.error('Lỗi khi lấy gợi ý sách:', error)
            res.status(500).json({ message: 'Lỗi khi lấy gợi ý sách', error })
        }
    }
}

export default new RecommendBookController()
