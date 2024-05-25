import {catchAsyncError} from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import {Appointment} from  "../models/appointmentSchema.js";
import {User} from "../models/userShema.js";

// routes for book appointment
export const postAppointment = catchAsyncError(async(req,res,next) => {

    // get all value by rer body 
    const {  
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address
    } = req.body;

    //if no any data found
    if( !firstName ||
        !lastName || 
        !email || 
        !phone || 
        !nic ||
        !dob || 
        !gender || 
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName || 
        !address ){
            return next(new ErrorHandler("Please Full Form!",400));
    }

    // why isConflict ????????????????????????
    const isConflict = await User.find({    //doctor is store in "isConflict" variable
        firstName : doctor_firstName,
        lastName:doctor_lastName,
        role:"Doctor",
        doctorDepartment:department
    });

    // if no doctor present the length is 0 so reurn error 
    if(isConflict.length === 0){
        return next(new ErrorHandler("Doctor Not Found!",400));
    }
    // if more then 1 doctor present generate error
    else if(isConflict.length > 1){
        return next(new ErrorHandler("Doctor Conflict! please Contact with Email or Phone Number!",400));
    }

    // find doctor id from that conflict variables
    const doctorId = isConflict[0]._id;

    // find patient id from req object
    const patientId = req.user._id;

    // create document in appointment db
    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
            firstName :doctor_firstName,
            lastName :doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId,
    })

    // send success message
    res.status(200).json({
        success:true,
        message:"Appointment Sends Successfully",
        appointment
    })

});

// routes for get all the appointments
export const getAllAppointment = catchAsyncError(async (req,res,next) => {
    const allAppointment = await Appointment.find();    // finding all appointment
    res.status(200).json({  //send success message
        success:true,
        allAppointment 
    })
});

// uppdate the status of that appointment which give in params of url()   "..../../......./:id"
export const updateAppointmentStatus = catchAsyncError(async (req,res,next) => {

    const { id } = req.params;       //get appointment id from frontend that provide in url    "....../........./..../:id"

    let appointment = await Appointment.findById(id);   // find appoointment from db that exist or not
    if (!appointment) {      // if not exist means no any appointment return error
        return next(new ErrorHandler("Appointment Not Found", 404));
    }

    // use try-catch block due to handling the error
    try {
        appointment = await Appointment.findByIdAndUpdate(      //find appointment and update that appointment
            id,         // pass id which want to update
            req.body,   // what to be update 
            {           //option
                new: true,
                runValidators: true, 
                useFindAndModify: false
            }
        );
        // send success message
        res.status(200).json({
            success: true,
            message: "Appointment Status Updated!",
            appointment,
        });
    } 

    //is any error message in error object the execute catch block 
    catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });  //return that error message
        }
        next(error);  // For other types of errors
    }


})

// routes for delete appointment
export const deleteAppointment = catchAsyncError( async (req,res,next) => {
    const {id} =req.params;     //get appointment id from frontend that provide in url    "....../........./..../:id"

    let appointment = await Appointment.findById(id);   // find appoointment from db that already exist or not
    if(!appointment){   // if not exist means no any appointment    return error
        return next(new ErrorHandler("Appointment Not Found",403))
    }

    await appointment.deleteOne(); // directly delete that appointment which find by id in line 131

    // send response
    res.status(200)
    .json({
        success:true,
        message:"Appointment Deleted!"
    });
})