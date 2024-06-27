import express from 'express';
import { signin, signup } from '../controller/authController.js';


const authRoute=express.Router();

authRoute.post('/signup',signup);
authRoute.post('/login',signin);

export default authRoute;