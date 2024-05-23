import { catchAsyncError } from "../middleware/catchAsyncError.js";
import {Message} from "../models/messageSchema.js" // import messsage model
import ErrorHandler from"../middleware/errorMiddleware.js"

export const sendMessage = catchAsyncError(async (req,res,next) => {
    const {firstName, lastName, email, phone, message } = req.body; // get data from req body
    if(!firstName || !lastName || !email || !phone || !message){ //if any daya can't get
        // sends this error message
        // return res.status(400).json({
        //     success:false,
        //     message:"Please Fill Full Form"
        // });

        // use for error handler middleware----
        return next(new ErrorHandler("Please Fill Full Form",400));
    }

    // if their is no any error then save data to db and sends success message
    await Message.create({ firstName, lastName, email, phone, message }) // create a document in database
    return res.status(200).json({
        success:true,
        message:"Message Send Successfully"
    });
})


export const getAllMessage = catchAsyncError(async (req, res, next) => {
    const messages = await Message.find();
    return res.status(200).json({
        success:true,
        messages
    })
})