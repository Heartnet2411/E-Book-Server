// models/index.js - Quản lý mối quan hệ giữa các model
import User from './User.js'
import RefreshToken from './RefreshToken.js'

// Thiết lập mối quan hệ một-một
User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE', // Khi xóa User, RefreshToken sẽ bị xóa theo
})
RefreshToken.belongsTo(User, {
    foreignKey: 'userId',
})

// Xuất ra các models
export { User, RefreshToken }
