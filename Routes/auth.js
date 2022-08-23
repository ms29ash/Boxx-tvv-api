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
import fetchIds from '../middleware/verify.js'

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
    [
        body('username', 'Enter the username').not().isEmpty().isLength({ min: 2 }),
        body('email', 'Enter a email address').not().isEmpty().isEmail(),
        body('password', 'Enter a password').not().isEmpty().isLength({ min: 6 }),
    ],
    async (req, res) => {

        const { email, username, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ success: false, message: errors.array() })
        }

        try {
            let user = await User.findOne({ email: email });
            if (user) {
                return res.status(409).json({ success: false, message: 'user already exists' })
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
            let otp = otpGenerator.generate(4, { specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false })


            let OtpVerify = {
                userId: user._id,
                OTP: otp
            }

            let otpObject = await UserVerify.create(OtpVerify);


            //mail Options
            let mailOptions = {
                from: "intercollage29@gmail.com",
                to: email,
                subject: "verification code",
                html: `Boxx 4 digit verification code <h1>${OtpVerify.OTP}</h1>`
            }

            //send mail to the user
            await transporter.sendMail(mailOptions);
            console.log('Email has been sent successfully');

            let data = {
                userId: user._id,
                verifyId: otpObject._id,
            }
            const authtoken = jwt.sign(data, process.env.JWT_SECRET);


            res.cookie('verifyToken', authtoken);

            res.status(201).json({ success: true })




        } catch (error) {
            console.log(error);
            console.log(error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" })

        }

    })


router.put('/verify', [
    body('otp', "Enter the correct otp").not().isEmpty().isLength({ min: 4, max: 4 })
], fetchIds, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({ success: false, errors: errors.array() })
    }

    const { userId, verifyId } = req.user;
    try {

        let userVerify = await UserVerify.findOne({ _id: verifyId });
        if (!userVerify) {
            return res.json({ success: false, error: "User not found" })
        }
        if (userVerify.OTP === req.body.otp) {
            await UserVerify.deleteOne({ _id: verifyId });
            await User.findOneAndUpdate({ _id: userId }, { verified: true })

            let data = {
                userId: userId,
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);

            return res.json({ success: true, token: token })
        } else {
            return res.status(403).json({ success: false, error: 'Otp not matched' })

        }



    } catch (errors) {

    }

})

export default router;