import express from 'express';
import Movies from '../Models/Movies.js'
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let movies = await Movies.find({});
        res.json(movies);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

router.post('/post', async (req, res) => {
    try {
        let movies = await Movies.create(req.body);
        res.json(movies);

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        let movie = await Movies.find({ _id: id });
        res.json(movie);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router;