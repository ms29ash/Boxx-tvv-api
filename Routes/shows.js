import express from 'express';
import Shows from '../Models/Shows.js'
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let shows = await Shows.find({});
        res.json(shows);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

router.post('/post', async (req, res) => {
    try {
        let shows = await Shows.create(req.body);
        res.json(shows);

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        let show = await Shows.find({ _id: id });
        res.json(show);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


export default router;