import mongoose from 'mongoose';
const { Schema } = mongoose;

const userVerifySchema = new Schema({
    OTP: { type: String },
    userId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const UserVerify = mongoose.model('userVerify', userVerifySchema);

export default UserVerify