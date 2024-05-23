import mongoose from "mongoose";
import validator from "validator"; // validation of data entered in schema

// creating message schema
const messageSchema = new mongoose.Schema ({
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
    message:{
        type:String,
        required:true,
        minLength:[10,"Message atleast contain 10 characters!"]
    }
})

// create models of that schema
export const Message = mongoose.model("Message",messageSchema) 