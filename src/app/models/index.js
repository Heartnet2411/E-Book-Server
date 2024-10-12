import User from './User.js'
import RefreshToken from './RefreshToken.js'
import Role from './Role.js'
import Topic from './Topic.js'
import Post from './Post.js'
import SavedPost from './SavedPost.js'
import FavoritePost from './FavoritePost.js'
import Book from './Book.js'
import Category from './Category.js'
import BookCategory from './BookCategory.js'

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

// Mối quan hệ giữa User và Post
User.hasMany(Post, {
    foreignKey: 'userId',
    as: 'posts',
    onDelete: 'CASCADE', // Khi User bị xóa, các Post liên quan cũng sẽ bị xóa
})
Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
})

// Mối quan hệ giữa User và FavoritePost
User.hasMany(FavoritePost, {
    foreignKey: 'userId',
    as: 'favoritePosts',
    onDelete: 'CASCADE',
})
FavoritePost.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
})

// Mối quan hệ giữa Post và FavoritePost
Post.hasMany(FavoritePost, {
    foreignKey: 'postId',
    as: 'favoriteByUsers',
    onDelete: 'CASCADE',
})
FavoritePost.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'post',
})

// Thiết lập mối quan hệ giữa User và SavedPost
User.hasMany(SavedPost, {
    foreignKey: 'userId',
    as: 'savedPosts', // Alias dùng trong câu lệnh include
    onDelete: 'CASCADE',
})
SavedPost.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
})

// Mối quan hệ giữa Post và SavedPost
Post.hasMany(SavedPost, {
    foreignKey: 'postId',
    as: 'savedPosts', // Alias dùng trong câu lệnh include
    onDelete: 'CASCADE',
})
SavedPost.belongsTo(Post, {
    foreignKey: 'postId',
    as: 'post', // Đặt alias cho mối quan hệ này
})

// Thiết lập mối quan hệ giữa Book và Category thông qua bảng trung gian
Book.belongsToMany(Category, {
    through: BookCategory,
    foreignKey: 'bookId',
    as: 'categories',
})
Category.belongsToMany(Book, {
    through: BookCategory,
    foreignKey: 'categoryId',
    as: 'books',
})

// Xuất ra các models
export {
    User,
    RefreshToken,
    Role,
    Topic,
    Post,
    FavoritePost,
    SavedPost,
    Book,
    Category,
    BookCategory,
}
