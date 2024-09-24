import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'
import User from './User.js' // Import model User để tạo mối quan hệ

// Định nghĩa model RefreshToken
const RefreshToken = sequelize.define(
    'RefreshToken',
    {
        id: {
            type: DataTypes.CHAR(50),
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
    },
    {
        tableName: 'refresh_tokens',
        timestamps: false,
    }
)

export default RefreshToken
