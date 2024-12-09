import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))
// app.use(cors())

// const corsOptions = {
//     origin: ['https://trendify-made-because-of-job-project-1.onrender.com', 'https://trendify-made-because-of-job-project.onrender.com',], // Replace with your client URL
//     methods: ['GET', 'POST','PATCH','DELETE'],
//     credentials: true
//   };
  
  app.use(cors({
    origin: ['http://localhost:4000','https://e-commerce-payment-gate-way-razor-pay-u1l4.onrender.com'],
    methods:['GET,PATCH,POST,DELETE,PUT'],
    credentials: true,
  }
  ));

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())

//routes import

import userRouter from './routes/user.routes.js'
import sellerRouter from './routes/seller.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/seller", sellerRouter)

export {app}