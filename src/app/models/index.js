import User from './User.js'
import RefreshToken from './RefreshToken.js'
import Role from './Role.js'
import Topic from './Topic.js'
import Post from './Post.js'

// Thiết lập mối quan hệ một-một
User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
})
RefreshToken.belongsTo(User, {
    foreignKey: 'userId',
})

// Thiết lập quan hệ một-nhiều với Role
Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users',
    onDelete: 'CASCADE',
})
User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
})

// Thiết lập mối quan hệ giữa Topic và Post
Topic.hasMany(Post, {
    foreignKey: 'topicId',
    as: 'posts',
    onDelete: 'CASCADE', // Khi Topic bị xóa, các Post liên quan cũng sẽ bị xóa
})
Post.belongsTo(Topic, {
    foreignKey: 'topicId',
    as: 'topic',
})

// Xuất ra các models
export { User, RefreshToken, Role, Topic, Post }
