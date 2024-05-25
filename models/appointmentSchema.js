import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema ({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First name should be of 3 character!"] // 3 is for minimum lenght and 2nd parameter is when condition not match the give that error
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"Last name should be of 3 character!"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "please provide a valid email!"] // validator.isEmail is use for checking the validation of email i.e email or not by validater npm package
    },
    phone:{
        type:String,
        required:true,
        maxLength:[10,"Phone number must contain 10 digits!"],
        minLength:[10,"Phone number must contain 10 digits!"]
    },
    nic:{
        type:String,
        required:true,
        minLength:[5,"NIC must contain Exist 5 digit!"],
        maxLength:[5,"NIC must contain Exist 5 digit!"],
    },
    dob:{
        type:Date,
        required:[true,"Date of Birth is required!"],
    },
    gender:{
        type:String,
        required:true,
        enum:["Male", "Female","Prefer-not-to-say", "Non-binary"],
    },
    appointment_date:{
        type:Date,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    doctor:{
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            require:true,
        }
    },
    hasVisited:{
        type:Boolean,
        default:false,
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    patientId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    }
})

export const Appointment = mongoose.model("Appointment",appointmentSchema);