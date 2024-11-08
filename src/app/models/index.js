import User from './User.js'
import RefreshToken from './RefreshToken.js'
import Role from './Role.js'
import Topic from './Topic.js'
import Post from './Post.js'
import Report from './Report.js'
import SavedPost from './SavedPost.js'
import FavoritePost from './FavoritePost.js'
import Book from './Book.js'
import Category from './Category.js'
import BookCategory from './BookCategory.js'
import BookComment from './BookComment.js'
import BookSaved from './BookSaved.js'
import PostComment from './PostComment.js'

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

// Thiết lập mối quan hệ giữa User và Book thông qua BookComment
// User có nhiều bình luận trên nhiều sách
User.hasMany(BookComment, { foreignKey: 'userId', as: 'comments' })

// Book có nhiều bình luận từ nhiều người dùng
Book.hasMany(BookComment, { foreignKey: 'bookId', as: 'comments' })

// BookComment thuộc về một User và một Book
BookComment.belongsTo(User, { foreignKey: 'userId', as: 'user' })
BookComment.belongsTo(Book, { foreignKey: 'bookId', as: 'book' })

User.hasMany(BookSaved, { foreignKey: 'userId' })
BookSaved.belongsTo(User, { foreignKey: 'userId' })

Book.hasMany(BookSaved, { foreignKey: 'bookId' })
BookSaved.belongsTo(Book, { foreignKey: 'bookId' })

// Thiết lập các quan hệ
Post.hasMany(PostComment, {
    foreignKey: 'postId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})
PostComment.belongsTo(Post, { foreignKey: 'postId' })

User.hasMany(PostComment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})
PostComment.belongsTo(User, { foreignKey: 'userId' })

// Tự tham chiếu để tạo mối quan hệ reply comment
PostComment.hasMany(PostComment, {
    foreignKey: 'replyId',
    as: 'Replies',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
})
PostComment.belongsTo(PostComment, {
    foreignKey: 'replyId',
    as: 'ParentComment',
})

Report.belongsTo(User,{
    foreignKey: 'userId',
})
User.hasMany(Report, {
    foreignKey: 'userId',
    as: 'reports',
});
// Quan hệ với Post
Report.belongsTo(Post, {
    foreignKey: 'targetId',
    constraints: false,
    // scope: {
    //     targetType: 'post',
    // },
});
Post.hasMany(Report, {
    foreignKey: 'targetId',
    as: 'postReports',
    constraints: false,
});
// Quan hệ với PostComment
Report.belongsTo(PostComment, {
    foreignKey: 'targetId',
    constraints: false,
    scope: {
        targetType: 'post_comment',
    },
});
PostComment.hasMany(Report, {
    foreignKey: 'targetId',
    as: 'postCommentReports',
    constraints: false,
});
// Quan hệ với BookComment
Report.belongsTo(BookComment, {
    foreignKey: 'targetId',
    constraints: false,
    scope: {
        targetType: 'book_comment',
    },
});
BookComment.hasMany(Report, {
    foreignKey: 'targetId',
    as: 'bookCommentReports',
    constraints: false,
});
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
    BookComment,
    BookSaved,
    PostComment,
    Report,
}
