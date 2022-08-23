import jwt from 'jsonwebtoken';

const fetchIds = async (req, res, next) => {
    const { verifyToken } = await req.cookies;
    if (!verifyToken) {
        res.status(404).send({ error: "Please authenticate using a valid token no token" })
    }
    try {
        const data = jwt.verify(verifyToken, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).json({ error: "Please authenticate using a valid token" })
    }
}

export default fetchIds;