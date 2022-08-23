import mongoose from 'mongoose';
import 'dotenv/config'
const mongoUri = process.env.MongoURI;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to Mongo');
    } catch (error) {
        console.log(error);
    }

}


export default connectToMongo;


