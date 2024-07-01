import express from 'express';
import { createListing,deleteList,editListing,getListing,getListings } from '../controller/listingController.js';
import { verifyToken } from '../utils/verifyUser.js';

const listingRouter = express.Router();

listingRouter.post('/create',verifyToken, createListing);
listingRouter.delete('/delete/:id',verifyToken,deleteList);
listingRouter.post('/edit/:id',verifyToken,editListing);
listingRouter.get('/get/:id',getListing);
listingRouter.get('/get',getListings);


export default listingRouter;