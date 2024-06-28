import Listing from "../models/Listing.js"


export const createListing=async(req,res,next)=>{
    try {
        const listing = await Listing.create(req.body);
        console.log(req.body)
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}