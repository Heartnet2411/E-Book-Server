import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

// Định nghĩa model BookSaved
const BookSaved = sequelize.define(
    'BookSaved',
    {
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        savedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Thời gian lưu sách
        },
    },
    {
        tableName: 'book_saved', // Tên bảng trong cơ sở dữ liệu
        timestamps: false, // Không sử dụng timestamps
    }
)

export default BookSaved
