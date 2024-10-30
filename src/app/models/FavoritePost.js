import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const FavoritePost = sequelize.define(
    'FavoritePost',
    {
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        timestamps: true,
        tableName: 'favorite_posts',
    }
)

export default FavoritePost
