import mongoose, { Schema } from "mongoose";
import validator from "validator"; // validation of data entered in schema
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// creating message schema
const userSchema = new mongoose.Schema ({
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
    password:{
        type:String,
        required:true,
        minLength:[8,"Password must contain atleast 8 digit!"],
        select:false, // use for not get password when try to get user data
    },
    role:{
        type:String,
        required:true,
        enum:["Doctor", "Admin","Patient"],
    },
    doctorDepartment:{
        type:String,
    },
    docAvatar:{
        public_id:String, //store the public ID fo image in a cloud storage service.
        url:String //use to store the url of string
    }
})

userSchema.pre("save",async function (next)  {  //user Schema save hone se pahle password pe kuch kaam krna 
    if(!this.isModified("password")){ //agar password nahi modified hai toh kuch nahi krna hai next middleware pe chale jao bas ;
        next();
    }
    this.password = await bcrypt.hash(this.password,10) //agar password modified hai toh usi instance ke pasword field me new password ko hasah karke fill kr do, hash function hame bcrypt package provide karta hai
})

userSchema.methods.comparePassword = async function(enterPassword) { //user schema ke method me ek naya camparePasswword function add kar do
    return await bcrypt.compare(enterPassword,this.password); // to match entered password and previous password, compare function also provide by bcrypt package
}


userSchema.methods.generateJsonWebToken = function(){ //use to generate tokens 
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{ //signin method takes payload that data which is unique ,secret key that is provide by developer, expiry date
        expiresIn:process.env.JWT_EXPIRES,
    })
}

// create models of that schema
export const User = mongoose.model("User",userSchema) 