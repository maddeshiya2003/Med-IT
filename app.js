import express, { urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors" // package for connect frontend and backend
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js"
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import userRouter from "./router/userRouter.js"

const app = express();

config({path:"./config/config.env"}) // use for load variable from dotenv file

// ---------------------------- Some middleware are discribe below ----------------------------

// use for connecting backend to frontend 
app.use(cors({
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL], //connect with 2 ports 
    methods:["GET","PUT","POST","DELETE"], // method which are use to connect with frontend
    credentials:true //accept credential that come from frontrnd
}));

app.use(cookieParser()); // to get cookies(small piece of data of user like session, authentication e.t.c.) that come from particular http request.
app.use(express.json()); // to convert or parse json data (which is comes from user in req.body) into string
app.use(express.urlencoded({extended:true})); // to make available user submitted data into req.body

// npm package that is handle for file upload by user input
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use("/api/v1/message",messageRouter); // message routes 
app.use("/api/v1/user",userRouter); // message routes

dbConnection(); //stablish connection to database

app.use(errorMiddleware); // if any error in req then it invoke middleware to handle the error and also this middleware check for all request 

export default app;