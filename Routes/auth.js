import express from 'express'
import User from '../Models/User.js'
const router = express.Router()
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator'
import UserVerify from '../Models/UserVerify.js'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import jwt from 'jsonwebtoken';
//middlewares
import fetchIds from '../middleware/verifyUser.js'

//Hash Password
const saltRounds = 10;

//ndoemailer stuff
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        host: "smtp.gmail.com",
        type: 'OAuth2',
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }, tls: {
        rejectUnauthorized: false,
    }
})



router.post('/signup',
    // Express validator
    [
        body('username', 'Enter the username').not().isEmpty().isLength({ min: 2 }),
        body('email', 'Enter a email address').not().isEmpty().isEmail(),
        body('password', 'Enter a password').not().isEmpty().isLength({ min: 6 }),
    ],
    async (req, res) => {

        const { email, username, password } = req.body;

        //Validation Errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ success: false, message: errors.array() })
        }

        try {
            //Find already exist user
            let user = await User.findOne({ email: email });
            if (user) {
                if (user.verified === true) {
                    return res.status(409).json({ success: false, message: 'user already exists' })
                } else {
                    //If user is not verified then delete user
                    User.findOneAndDelete({ email: email });
                }
            }

            //generating hash for password
            const salt = await bcrypt.genSalt(saltRounds);
            const hashPass = await bcrypt.hash(password, salt)

            // Creating user 
            user = await User.create({
                username: username,
                email: email,
                password: hashPass,
            })
            if (!user) {
                res.status(500).json({ success: false, message: "User already exists" })
            }

            //Generating OTP
            let otp = otpGenerator.generate(4, { specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false })

            let OtpVerify = {
                userId: user._id,
                OTP: otp
            }
            //Saving OTP in database
            let otpObject = await UserVerify.create(OtpVerify);


            //mail Options
            let mailOptions = {
                from: "intercollage29@gmail.com",
                to: email,
                subject: "verification code",
                html: `Boxx 4 digit verification code <h1>${OtpVerify.OTP}</h1>`
            }

            //send mail to the user
            const mail = await transporter.sendMail(mailOptions);
            if (mail) {
                console.log(mail);


                let data = {
                    userId: user._id,
                    verifyId: otpObject._id,
                }
                //encrypting data in jwt token
                const authToken = jwt.sign(data, process.env.JWT_SECRET);
                res.status(201).json({ success: true, authToken: authToken, message: 'Email has been sent successfully' })
            }

        } catch (error) {
            console.log(error);
            console.log(error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" })

        }

    })


router.put('/verify',
    //Express validator
    [
        body('otp', "Enter the correct otp").not().isEmpty().isLength({ min: 4, max: 4 })
    ]
    //fetching ids
    , fetchIds, async (req, res) => {
        //Validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ success: false, errors: errors.array() })
        }

        const { userId, verifyId } = req.user;
        try {

            let userVerify = await UserVerify.findOne({ _id: verifyId });
            //Find Otp in database
            if (!userVerify) {
                return res.json({ success: false, error: "User not found" })
            }
            //Matching Otp
            if (userVerify.OTP === req.body.otp) {
                await UserVerify.deleteOne({ _id: verifyId });
                await User.findOneAndUpdate({ _id: userId }, { verified: true })

                let data = {
                    userId: userId,
                }
                const token = jwt.sign(data, process.env.JWT_SECRET);


                return res.json({ success: true, message: "verified email", token: token })
            } else {
                return res.status(403).json({ success: false, error: 'Otp not matched' })

            }
        } catch (errors) {
            console.log(errors);
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }

    })


router.post('/signin',
    // Express validator
    [
        body('email', 'Enter a email address').not().isEmpty().isEmail(),
        body('password', 'Enter a password').not().isEmpty().isLength({ min: 6 }),
    ],
    async (req, res) => {
        const { email, password } = req.body;
        try {
            //Finding User
            let user = await User.findOne({ email: email });
            //User not found
            if (!user) {
                return res.status(409).json({ success: false, message: 'no such user exist' })
            } else {
                //Matching Password
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    let data = {
                        userId: user._id,
                    }
                    const token = jwt.sign(data, process.env.JWT_SECRET);


                    return res.status(200).json({ success: true, message: "Signed In", token: token })
                } else {
                    return res.status(401).json({ success: false, error: "Wrong Password" })
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }

    })

router.post('/user', fetchIds, async (req, res) => {

    const { userId } = req.user;
    try {
        //Finding User
        let user = await User.findOne({ _id: userId });
        if (user) {
            console.log(user);
            return res.status(200).send({ success: true, user: { email: user.email, username: user.username, watchlist: user.watchlist, favorites: user.favorites } });
        } else {
            return res.status(401).send('user not found');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }



})

export default router;