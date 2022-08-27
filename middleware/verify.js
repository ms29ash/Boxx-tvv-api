import jwt from 'jsonwebtoken';

const fetchIds = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        res.status(404).send({ error: "Please authenticate using a valid token no token" })
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).json({ error: "Please authenticate using a valid token" })
    }
}

export default fetchIds;