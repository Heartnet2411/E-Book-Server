import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Report = sequelize.define(
    'Report',
    {
        reportId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        targetType: {
            type: DataTypes.ENUM('book_comment', 'post_comment', 'post'),
            allowNull: false,
        },
        targetId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'reviewed', 'hidden'),
            defaultValue: 'pending',
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: 'reports',
    }
)

export default Report
