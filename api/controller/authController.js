import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/error.js";

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

export {signup};