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
            type: DataTypes.CHAR(36),
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        timestamps: true,
    }
)

export default FavoritePost
