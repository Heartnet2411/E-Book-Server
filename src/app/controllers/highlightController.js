import { Highlight } from '../models/index.js'
class HighlightController {
    async createHighlight(req, res) {
        const { userId, bookId, text, cfiRange, color } = req.body.highlight
        try {
            const highlight = await Highlight.create({
                userId,
                bookId,
                text,
                cfiRange,
                color,
            })
            res.status(201).json(highlight)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
    async getHighlights(req, res) {
        const { userId, bookId } = req.params
        try {
            const highlights = await Highlight.findAll({
                where: {
                    userId,
                    bookId,
                },
                order: [['date', 'DESC']],
            })
            res.status(200).json(highlights)
        } catch (error) {
            console.error('ERR', error)
            res.status(400).json({ message: error.message })
        }
    }
    async deleteHighlight(req, res) {
        const { highlightId } = req.params
        try {
            const highlight = await Highlight.findByPk(highlightId)
            if (!highlight) {
                return res.status(404).json({ message: 'Highlight not found' })
            }
            await highlight.destroy()
            res.status(200).json({ message: 'Highlight deleted' })
        } catch (error) {
            console.error('err ', error)
            res.status(400).json({ message: error.message })
        }
    }
}
export default new HighlightController()
