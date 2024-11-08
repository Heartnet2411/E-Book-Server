import { BookReader } from '../models/index.js'

class BookReaderController {
    async userReader(req, res) {
        const bookId = req.params.bookId
        const userId = req.user.userId
    }
}

export default new BookReaderController()
