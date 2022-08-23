import mongoose from 'mongoose';
const { Schema } = mongoose;

const showSchema = new Schema({
    name: { type: String },
    year: { type: Number },
    seasons: { type: Number },
    description: { type: String },
    category: { type: String },
    poster: { type: String },
    thumbnail: { type: String },
    ratings: { type: Number }
});

const Shows = mongoose.model('Shows', showSchema);

export default Shows;