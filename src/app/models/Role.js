import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js' // Giả sử bạn đã có file kết nối Sequelize

const Role = sequelize.define(
    'Role',
    {
        roleId: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        roleName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: 'roles',
    }
)

export default Role
