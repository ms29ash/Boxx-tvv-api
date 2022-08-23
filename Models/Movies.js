import mongoose from 'mongoose';
const { Schema } = mongoose;

const movieSchema = new Schema({
    "name": { type: String, required: true },
    "year": { type: Number, required: true },
    "time": { type: String, required: true },
    "cast": { type: String, required: true },
    "description": { type: String, required: true },
    "category": { type: String, required: true },
    "poster": { type: String, required: true },
    "thumbnail": { type: String, required: true },
    "ratings": { type: Number, required: true },
});

const Movies = mongoose.model('Movies', movieSchema);

export default Movies;