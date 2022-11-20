import mongoose from 'mongoose';
const { Schema } = mongoose;

const listSchema = new Schema({
    type: { type: String },
    id: { type: String },
}, { sparse: true, timestamps: { createdAt: true, updatedAt: false } })

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    watchlater: [listSchema],
    favorites: [listSchema],

}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;