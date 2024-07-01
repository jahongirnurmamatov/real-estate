import Listing from "../models/Listing.js";
import User from "../models/User.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcryptjs';

const deleteUser = async (req,res,next)=>{
    if(req.user.id!==req.params.id) return next(errorHandler(401,'You can only delete your own account'))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json({success:true,message:"User has been deleted"});
    } catch (error) {
        next(error)
    }
}
const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account'));
    
    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password,10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password: req.body.password,
                avatar:req.body.avatar
            }
        },{new:true})
        const {password, ...rest}=updatedUser._doc;
        res.status(200).json({success:true,rest});
    } catch (error) {
        next(error)
    }
}
const getUserListing = async(req,res,next)=>{
    if(req.params.id!==req.user.id){
       return next(errorHandler('You can only view your own listings'));
    }
    try {
        const listings = await Listing.find({userRef:req.params.id});
        res.status(200).json(listings);

    } catch (error) {
        next(error.message)
    }
}
const getUser = async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user) {return next(errorHandler(404,'User does not exist!'));}
        const {password: pass, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}
export { getUser, updateUser,deleteUser,getUserListing };