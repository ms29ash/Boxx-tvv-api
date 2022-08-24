import express from 'express';
import Anime from '../Models/Anime.js'
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let anime = await Anime.find({});
        res.json(anime);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

router.post('/post', async (req, res) => {
    try {
        let anime = await Anime.create(req.body);
        res.json(anime);

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        let anime = await Anime.find({ _id: id });
        res.json(anime);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router;