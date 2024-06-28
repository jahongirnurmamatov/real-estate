import express from 'express';
import { getUser, updateUser } from '../controller/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const userRoute=express.Router();

userRoute.get('/getuser',getUser);
userRoute.post('/update/:id',verifyToken,updateUser);

export default userRoute;