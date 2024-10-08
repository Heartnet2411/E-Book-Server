import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Post = sequelize.define(
    'Post',
    {
        postId: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
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
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(1000),
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
    }
)

export default Post
