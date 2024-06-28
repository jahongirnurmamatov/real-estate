import Listing from "../models/Listing.js"
import { errorHandler } from "../utils/error.js";


export const createListing=async(req,res,next)=>{
    try {
        const listing = await Listing.create(req.body);
        console.log(req.body)
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}
export const  deleteList=async(req,res,next)=>{
   
    const listing =await Listing.findById(req.params.id);
    console.log(listing.userRef, req.user.id)
    if(!listing){
        return next(errorHandler(404,'Listing not found!'))
    }
    if(req.user.id!==listing.userRef){
        return next(errorHandler(401,'You can only delete your own listing'));
    };
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing deleted')
    } catch (error) {
        next(error)
    }
}