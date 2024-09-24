import crypto from 'crypto'

export const generateRandomHexId = (length) => {
    return crypto.randomBytes(length).toString('hex') // Chuyển đổi thành chuỗi hex
}
