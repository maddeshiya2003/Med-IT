// this file use for authentication of admin to proceed further process if not admin then it not allow to procede further any process and send msg that you not allow fir this request 

import {catchAsyncError} from "./catchAsyncError.js";
import {User}  from "../models/userShema.js"
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";


// yeh middleware admin users ko authenticate karke unhe kisi specific process ko access karne ki permission deta hai.
//midddleware for verify the token and check user is admin or not then after it give permission to that admin user.
export const isAdminAuthenticated = catchAsyncError(async(req,res,next)=>{

    // Authentication is the process of verifying the identity of a user.
    const token = req.cookies.adminToken;   //fetch tpken from cookies that present in request object
    if(!token){
        return next(new ErrorHandler("Admin Not Authenticated",400));   //send error msg
    } 
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);  //check and verify token, after verify token it return id of that admin user like=== {
                                                                                                                                                    //     "id": "60c72b2f9b1e8a0015c5e5b6",
                                                                                                                                                    //     "iat": 1623600000,
                                                                                                                                                    //     "exp": 1623603600
                                                                                                                                                    //   }

    // Authorization is the process of determining whether a user has the necessary permissions to access a specific resource or perform a specific action.                                                                                                                                                  
    req.user = await User.findById(decoded.id);  //decoded.id from decoded token is used to fetch the user from the database and save to current http request object 
    if(req.user.role !== "Admin"){  // if that user role is not admin
        return next(new ErrorHandler(`${req.user.role} Not Authorized for this process`,403));  //send error msg
    }
    next(); // if token is valid and user is admin then proceed to next middleware
})




// yeh middleware pateint users ko authenticate karke unhe kisi specific process ko access karne ki permission deta hai.
//midddleware for verify the token and check user is patient or not then after it give permission to that patient user.
export const isPatientAuthenticated = catchAsyncError(async(req,res,next)=>{

    // Authentication is the process of verifying the identity of a user.
    const token = req.cookies.patientToken;   //fetch tpken from cookies that present in request object
    if(!token){
        return next(new ErrorHandler("Patient Not Authenticated",400));   //send error msg
    } 
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
      //check and verify token, after verify token it return id of that admin user like=== {
                                                                                                                                                    //     "id": "60c72b2f9b1e8a0015c5e5b6",
                                                                                                                                                    //     "iat": 1623600000,
                                                                                                                                                    //     "exp": 1623603600
                                                                                                                                                    //   }

    // Authorization is the process of determining whether a user has the necessary permissions to access a specific resource or perform a specific action.                                                                                                                                                  
    req.user = await User.findById(decoded.id);  //decoded.id from decoded token is used to fetch the user from the database and save to current http request object 
    if(req.user.role !== "Patient"){  // if that user role is not patient
        return next(new ErrorHandler(`${req.user.role} Not Authorized for this process`,403));  //send error msg
    }
    next(); // if token is valid and user is patient then proceed to next middleware
})




// yeh middleware doctor users ko authenticate karke unhe kisi specific process ko access karne ki permission deta hai.
//midddleware for verify the token and check user is doctor or not then after it give permission to that doctor user.
export const isDoctorAuthenticated = catchAsyncError(async(req,res,next)=>{

    // Authentication is the process of verifying the identity of a user.
    const token = req.cookies.doctorToken;   //fetch token from cookies that present in request object
    if(!token){
        return next(new ErrorHandler("Doctor Not Authenticated",400));   //send error msg
    } 
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);  //check and verify token, after verify token it return id of that admin user like=== {
                                                                                                                                                    //     "id": "60c72b2f9b1e8a0015c5e5b6",
                                                                                                                                                    //     "iat": 1623600000,
                                                                                                                                                    //     "exp": 1623603600
                                                                                                                                                    //   }

    // Authorization is the process of determining whether a user has the necessary permissions to access a specific resource or perform a specific action.                                                                                                                                                  
    req.user = await User.findById(decoded.id);  //decoded.id from decoded token is used to fetch the user from the database and save to current http request object 
    if(req.user.role !== "Doctor"){  // if that user role is not doctor
        return next(new ErrorHandler(`${req.user.role} Not Authorized for this process`,403));  //send error msg
    }
    next(); // if token is valid and user is doctor then proceed to next middleware
})