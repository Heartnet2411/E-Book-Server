import { Category } from '../models/index.js'

class CategoryController {
    // Tạo mới một thể loại
    async createCategory(req, res) {
        try {
            const { name } = req.body
            const newCategory = await Category.create({ name })
            res.status(201).json(newCategory)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Lấy tất cả các thể loại
    async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll()
            res.status(200).json(categories)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Lấy thông tin thể loại theo ID
    async getCategoryById(req, res) {
        try {
            const { categoryId } = req.params
            const category = await Category.findByPk(categoryId)

            if (!category) {
                return res.status(404).json({ message: 'Category not found' })
            }

            res.status(200).json(category)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Cập nhật thông tin thể loại
    async updateCategory(req, res) {
        try {
            const { categoryId } = req.params
            const { name } = req.body

            const category = await Category.findByPk(categoryId)
            if (!category) {
                return res.status(404).json({ message: 'Category not found' })
            }

            await category.update({ name })
            res.status(200).json(category)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Xóa thể loại
    async deleteCategory(req, res) {
        try {
            const { categoryId } = req.params
            const category = await Category.findByPk(categoryId)
            if (!category) {
                return res.status(404).json({ message: 'Category not found' })
            }

            await category.destroy()
            res.status(200).json({ message: 'Category deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new CategoryController()
