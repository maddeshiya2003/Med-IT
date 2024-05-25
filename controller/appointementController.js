import {catchAsyncError} from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import {Appointment} from  "../models/appointmentSchema.js";
import {User} from "../models/userShema.js";

export const postAppointment = catchAsyncError(async(req,res,next) => {

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

    const isConflict = await User.find({    //doctor is store in isConflict variable
        firstName : doctor_firstName,
        lastName:doctor_lastName,
        role:"Doctor",
        doctorDepartment:department
    });

    if(isConflict.length === 0){
        return next(new ErrorHandler("Doctor Not Found!",400));
    }
    else if(isConflict.length > 1){
        return next(new ErrorHandler("Doctor Conflict! please Contact with Email or Phone Number!",400));
    }

    const doctorId = isConflict[0]._id;

    const patientId = req.user._id;

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

    res.status(200).json({
        success:true,
        message:"Appointment Sends Successfully",
        appointment
    })

});

export const getAllAppointment = catchAsyncError(async (req,res,next) => {
    const allAppointment = await Appointment.find();
    res.status(200).json({
        success:true,
        allAppointment 
    })
});

export const updateAppointmentStatus = catchAsyncError(async (req,res,next) => {

    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found", 404));
    }

    try {
        appointment = await Appointment.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true, 
                useFindAndModify: false
            }
        );
        res.status(200).json({
            success: true,
            message: "Appointment Status Updated!",
            appointment,
        });
    } 
    catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        next(error);  // For other types of errors
    }


})

export const deleteAppointment = catchAsyncError( async (req,res,next) => {
    const {id} =req.params;

    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found",403))
    }

    await appointment.deleteOne();

    res.status(200)
    .json({
        success:true,
        message:"Appointment Deleted!"
    });
})