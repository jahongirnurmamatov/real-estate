import express from 'express';
import { google, signin, signout, signup } from '../controller/authController.js';


const authRoute=express.Router();

authRoute.post('/signup',signup);
authRoute.post('/login',signin);
authRoute.post('/google',google);
authRoute.post('/logout',signout);
export default authRoute;