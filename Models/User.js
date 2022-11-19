import mongoose from 'mongoose';
const { Schema } = mongoose;

const listSchema = new Schema({
    type: { type: String, required: true },
    id: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } })

const userSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    watchlater: [listSchema],
    favorites: [listSchema],

}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;