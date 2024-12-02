import { Bookmark } from '../models/index.js'

class BookMarkController {
    async createBookmark(req, res) {
        const { userId, bookId, location, content } = req.body
        try {
            const bookmark = await Bookmark.create({
                userId,
                bookId,
                location,
                content,
            })
            res.status(201).json(bookmark)
        } catch (error) {
            console.error('Error creating bookmark:', error)
            res.status(500).json({ error: error.message })
        }
    }
    async getBookmarksByUserAndBook(req, res) {
        const { userId, bookId } = req.params
        try {
            const bookmarks = await Bookmark.findAll({
                where: {
                    userId,
                    bookId,
                },
            })

            res.status(200).json(bookmarks)
        } catch (error) {
            console.error(
                'Error fetching bookmarks by userId and bookId:',
                error
            )
            res.status(500).json({ error: error.message })
        }
    }
    async deleteBookmark(req, res) {
        const { bookmarkId } = req.params;
    
        try {
            const result = await Bookmark.destroy({
                where: { bookmarkId },
            });
    
            if (result === 0) {
                console.log('No bookmark found to delete.');
                return res.status(404).json({
                    success: false,
                    message: 'Bookmark not found.',
                });
            }
    
            console.log('Bookmark deleted successfully.');
            return res.status(200).json({
                success: true,
                message: 'Bookmark deleted successfully.',
            });
        } catch (error) {
            console.error('Error deleting bookmark:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the bookmark.',
                error: error.message,
            });
        }
    }
    
}
export default new BookMarkController()
