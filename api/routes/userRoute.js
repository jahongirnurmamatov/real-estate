import express from 'express';
import { deleteUser, getUser, updateUser } from '../controller/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const userRoute=express.Router();

userRoute.get('/getuser',getUser);
userRoute.post('/update/:id',verifyToken,updateUser);
userRoute.delete('/delete/:id',verifyToken,deleteUser);


export default userRoute;