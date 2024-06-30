import Listing from "../models/Listing.js"
import { errorHandler } from "../utils/error.js";


export const createListing=async(req,res,next)=>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}
export const  deleteList=async(req,res,next)=>{
   
    const listing =await Listing.findById(req.params.id);
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
export const editListing = async (req, res, next) => {
    console.log('message from fronend')
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, 'You can only edit your own listing'));
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};

export const getListing = async(req,res,next)=>{
 try {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,'No listing found!'));
    };
    res.status(200).json(listing);
 } catch (error) {
    next(error);
 }   
}