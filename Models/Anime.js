import mongoose from 'mongoose';
const { Schema } = mongoose;

const animeSchema = new Schema({
    name: { type: String },
    year: { type: Number },
    seasons: { type: Number },
    description: { type: String },
    category: { type: String },
    poster: { type: String },
    thumbnail: { type: String },
    ratings: { type: Number },
    channel: { type: String },
});

const Anime = mongoose.model('Anime', animeSchema);

export default Anime;