import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js' // Đảm bảo bạn đã cấu hình Sequelize

const Topic = sequelize.define(
    'Topic',
    {
        topicId: {
            type: DataTypes.UUID, // UUID
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4, // Tự động tạo UUID
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        state: {
            type: DataTypes.ENUM('pending', 'approved', 'hidden'),
            allowNull: false,
            defaultValue: 'pending', // Trạng thái mặc định là "đang chờ kiểm duyệt"
        },
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        hiddenReason:{
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue:''
        }
    },
    {
        timestamps: true,
        tableName: 'topics',
    }
)

export default Topic
