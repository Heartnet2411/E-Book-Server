import express from 'express';
import reportController from '../app/controllers/reportController.js'
import authenticateToken from '../middleware/authenticateToken.js'
import authenticateAdmin from '../middleware/authenticateAdmin.js';
import adminController from '../app/controllers/adminController.js';
const router = express.Router();

router.post('/create',authenticateToken, reportController.createReport); // Tạo báo cáo mới
router.get('/', authenticateAdmin, reportController.getReports); // Lấy tất cả báo cáo
router.put('/:reportId', authenticateAdmin, reportController.updateReport); // Cập nhật trạng thái báo cáo
router.delete('/:reportId', authenticateAdmin, reportController.deleteReport); // Xóa báo cáo
router.get('/post',authenticateAdmin,reportController.getReportedPosts)
router.post('/hide-post/:postId',authenticateAdmin,reportController.hideReportPost) // ẩn bài viết và báo cáo tương ứng 
router.put('/decline-hide-post/:postId',authenticateAdmin,reportController.declineHideReportPost) //
router.get('/get-reason-report/:postId',authenticateAdmin,reportController.getReasonReportPost)
router.post('/hide-comment/:commentId',authenticateAdmin,reportController.hideReportComment)
export default router;