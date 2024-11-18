import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'
import bcrypt from 'bcryptjs'

// Định nghĩa model User
const User = sequelize.define(
    'User',
    {
        userId: {
            type: DataTypes.CHAR(100),
            primaryKey: true,
        },
        gender: {
            //male = 1(true); female = 0(false)
            type: DataTypes.BOOLEAN,
        },
        roleId: {
            type: DataTypes.CHAR(100),
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(50),
        },
        avatar: {
            type: DataTypes.STRING(255),
        },
        background: {
            type: DataTypes.STRING(255),
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'users',
        timestamps: false,
    }
)

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
User.beforeCreate(async (user) => {
    const saltRounds = 10
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) throw err
        user.password = hash
    })
})

export default User
