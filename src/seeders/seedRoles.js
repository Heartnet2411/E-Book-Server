import { Role } from '../app/models/index.js'

const seedRoles = async () => {
    try {
        const roles = [
            { roleId: 'role_user', roleName: 'User' },
            { roleId: 'admin', roleName: 'Admin' },
        ]

        for (const roleData of roles) {
            const role = await Role.findOne({
                where: { roleName: roleData.roleName },
            })
            if (!role) {
                await Role.create(roleData)
                console.log(`Role "${roleData.roleName}" đã được tạo.`)
            }
        }

        console.log('Seed roles thành công.')
    } catch (error) {
        console.error('Seed roles thất bại:', error)
    }
}

export default seedRoles
