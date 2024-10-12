import express from 'express'
import categoryController from '../app/controllers/categoryController.js'
const router = express.Router()

router.post('/', categoryController.createCategory) // Tạo mới thể loại
router.get('/', categoryController.getAllCategories) // Lấy tất cả thể loại
router.get('/:categoryId', categoryController.getCategoryById) // Lấy thông tin thể loại theo ID
router.put('/:categoryId', categoryController.updateCategory) // Cập nhật thông tin thể loại
router.delete('/:categoryId', categoryController.deleteCategory) // Xóa thể loại

export default router
