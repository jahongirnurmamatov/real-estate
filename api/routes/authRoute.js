import express from 'express';
import { google, signin, signup } from '../controller/authController.js';


const authRoute=express.Router();

authRoute.post('/signup',signup);
authRoute.post('/login',signin);
authRoute.post('/google',google);
export default authRoute;