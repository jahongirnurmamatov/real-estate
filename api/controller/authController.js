import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

const signup=async(req,res,next)=>{
    const {username,email,password}=req.body;
    if(!username||!email||!password){
        next(errorHandler(550,'Missing fields'));
        return;
    }
    if(password.length<6){
        next(errorHandler(550,'Password length must be minumum 6 characters'));
        return;
    }
    const hashedPassword=bcrypt.hashSync(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    try {
        await newUser.save();
        res.status(201).json({success:true,message:'user signed up'})
    } catch (error) {
       next(error)
    }
}

const signin =async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password) return next(errorHandler(401,'Missing fields!'))
    try {
        const existingUser =await User.findOne({email});
        if(existingUser){
            const isPassValid = bcrypt.compareSync(password,existingUser.password);
            if(!isPassValid){
                return next(errorHandler(401,'Invalid credentials'));
            };
            const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRET);
            const {password:pass,...rest}=existingUser._doc;
            res.cookie('access-token',token,{
                httpOnly:true, 
            }).status(200).json({success:true,rest});
        }else{
            next(errorHandler(404,'User not registered!'))
        }
    } catch (error) {
        next(error

        )
    }
}
export {signup,signin };