import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Bookmark = sequelize.define(
    'Bookmark',
    {
        bookmarkId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING, // Lưu trữ vị trí bookmark (có thể là CFI hoặc page)
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING, // Lưu trữ tên của chương hoặc nội dung của bookmark
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    { timestamps: true, tableName: 'bookmarks' }
)

export default Bookmark
