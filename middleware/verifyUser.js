import jwt from 'jsonwebtoken';

const fetchIds = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(404).send({ error: "Please authenticate using a valid token no token" })
        } else {
            console.log('token')
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data;
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Please authenticate using a valid token" })
    }
}

export default fetchIds;