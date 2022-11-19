import express from "express";
const addListRouter = express.Router();
const removeListRouter = express.Router();
const listRouter = express.Router();
import fetchIds from '../middleware/verifyUser.js'
import User from '../Models/User.js'

addListRouter.post('/:list', fetchIds, async (req, res) => {
    try {
        const { userId } = req.user;
        let list = req.params.list;
        let user = await User.findOne({ _id: userId })
        if (list === 'favorites') {
            let update = user?.favorites?.push(req.body.item);
            await user.save()
            return res.status(201).send({ success: true, message: `Added to ${list}`, item: user.favorites[update - 1] })
        } else if (list === 'watchlater') {
            let update = user?.watchlater?.push(req.body.item);
            await user.save()
            return res.status(201).send({ success: true, message: `Added to ${list}`, item: user?.watchlater[update - 1] })
        } else {
            return res.status(400).send({ success: false, message: "Something wrong" })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' })
    }

})

removeListRouter.put('/:list', fetchIds, async (req, res) => {
    try {
        const { userId } = req.user;
        let list = req.params.list;
        let user = await User.findOne({ _id: userId });
        if (list === 'favorites') {
            user.favorites.splice(req.body.id, 1);
        } else if (list === 'watchlater') {
            user.watchlater.splice(req.body.id, 1);
        }
        let updatelist = await user.save();
        return res.status(201).send({ success: true, message: 'Removed to Watchlist' })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' })

    }
})
listRouter.get('/:list', fetchIds, async (req, res) => {
    try {
        const { userId } = req.user;
        let list = req.params.list;
        let user = await User.findOne({ _id: userId });
        if (list === 'favorites') {
            return res.status(200).send({ favorites: user.favorites })
        } else if (list === 'watchlater') {
            return res.status(200).send({ watchlist: user.watchlater })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' })

    }
})

export { addListRouter, removeListRouter, listRouter }