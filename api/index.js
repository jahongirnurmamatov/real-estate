import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listingRoute.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_DB).then(()=>console.log('MongoDB is connected'))
.catch((err)=>console.log(err))

//routes
app.use('/api/user',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/listing',listingRouter);

app.use((err,req,res,next) =>{
    const statusCode = err.statusCode||500;
    const message = err.message||'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});
