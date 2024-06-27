import express from 'express';
import { signup } from '../controller/authController.js';


const authRoute=express.Router();

authRoute.post('/signup',signup);

export default authRoute;