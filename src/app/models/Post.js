import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Post = sequelize.define(
    'Post',
    {
        postId: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        topicId: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        userAvatar: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(60000),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: 'posts',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    }
)

export default Post
