import sequelize from '../connection/connection.js'
import seedRoles from './seedRoles.js'
import { Role, User, RefreshToken } from '../app/models/index.js'

const runSeeder = async () => {
    try {
        await sequelize.authenticate()
        console.log('Kết nối cơ sở dữ liệu thành công.')

        await sequelize.sync() // Đồng bộ các model với cơ sở dữ liệu

        await seedRoles() // Seed roles

        process.exit(0) // Thoát chương trình khi hoàn tất
    } catch (error) {
        console.error('Seed thất bại:', error)
        process.exit(1)
    }
}

runSeeder()
