import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'

function router(app) {
    app.use('/api/user', authRoutes)

    app.use('/api/admin', adminRoutes)
}

export default router
