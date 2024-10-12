import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Book = sequelize.define('Book', {
    bookId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    isbn: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    bookName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    publisher: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    epubUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})

export default Book
