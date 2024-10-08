import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js' // Đảm bảo bạn đã cấu hình Sequelize

const Topic = sequelize.define(
    'Topic',
    {
        topicId: {
            type: DataTypes.CHAR(36), // UUID
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4, // Tự động tạo UUID
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: 'topics',
    }
)

export default Topic
