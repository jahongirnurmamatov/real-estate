import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        next(errorHandler(550, 'Missing fields'));
        return;
    }
    if (password.length < 6) {
        next(errorHandler(550, 'Password length must be minumum 6 characters'));
        return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ success: true, })
    } catch (error) {
        next(error)
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(errorHandler(401, 'Missing fields!'))
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const isPassValid = bcrypt.compareSync(password, existingUser.password);
            if (!isPassValid) {
                return next(errorHandler(401, 'Invalid credentials'));
            };
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = existingUser._doc;
            res.cookie('access_token', token, {
                httpOnly: true,
            }).status(200).json({ success: true, rest });
        } else {
            next(errorHandler(404, 'User not registered!'))
        }
    } catch (error) {
        next(error

        )
    }
}
const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.cookie('access_token', token, {
                httpOnly: true,
            }).status(200).json({ success: true, rest });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase()+ Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword, avatar:req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, {
                httpOnly: true,
            }).status(200).json({ success: true, rest });
        }
    } catch (error) {
        next(error)
    }
}
const signout =async(req,res,next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json({success:true,message:'User has signed out!'})
    } catch (error) {
        next(error)
    }
}
export { signup, signin ,google,signout};