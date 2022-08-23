import express from 'express';
import connectToMongo from './db.js';
import shows from './Routes/shows.js';
import movies from './Routes/movies.js';
import auth from './Routes/auth.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'

//Initialize app
const app = express();
//set port 
const port = process.env.PORT || 4000;
//Connecting to database
connectToMongo();

app.use(cors())
app.use(express.json());
app.use(cookieParser());




app.get('/', (req, res) => {
    res.send('Boxx Hello')
})


app.use('/movies', movies);
app.use('/shows', shows);
app.use('/auth', auth);

app.listen(port, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`App is listening on ${port}`);
    }
})