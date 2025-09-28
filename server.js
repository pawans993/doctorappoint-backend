import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import { connect } from 'mongoose';
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
// app config...
const app=express();
const port=process.env.PORT || 4000;

connectDB();
connectCloudinary();

// middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://doctorappoint-frontend.vercel.app/"],
  credentials: true,
}));




// api endpoints

app.use('/api/admin',adminRouter);
app.use('/api/doctor',doctorRouter);

app.use('/api/user',userRouter);











app.get('/',(req,res)=>{
  res.send('Api working');
})
app.listen(port,()=>{
  console.log(`our server  start on ${port}`);
})




