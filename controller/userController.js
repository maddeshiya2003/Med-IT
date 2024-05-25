import { catchAsyncError } from "../middleware/catchAsyncError.js";
import {User} from "../models/userShema.js" // import messsage model
import ErrorHandler from"../middleware/errorMiddleware.js"
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary"

// register new patient
export const patientRegister = catchAsyncError(async(req,res,next) => {
    const {firstName, lastName, email, phone, password, nic, dob, gender, role } = req.body; // get data from req body

    if(!firstName || !lastName || !email || !phone || !password|| !nic || !dob || !gender || !role){ //if any daya can't get
        return next(new ErrorHandler("Please Fill Full Form!",400));
    }

    let user = await User.findOne({email}) // find user is already exist in db or not

    if(user){ //if any user are get or exist then
        return next(new ErrorHandler("User already registered!",400));
    }

    // if user not present in db on not exist in db then create document
    user = await User.create({
        firstName,
        lastName, 
        email, 
        phone, 
        password, 
        nic, 
        dob, 
        gender, 
        role
    })

    // send successfull msg to user that user is registered
    // res.status(200).json({
    //     success:true,
    //     message:"User Registered",
    // })

    // this function is use for generate token which discribe in "utiles/generateToken" and this use as place of above successfull code
    generateToken(user, "User Registered!", 200, res);
    
});

// for login 
export const login = catchAsyncError(async(req,res,next) => {
    const {email, password, confirmPassword, role } = req.body; // get data from req body
    
    if(!email || !role || !password|| !confirmPassword ){ //if any daya can't get
        return next(new ErrorHandler("Please Fill Full Form!",400));
    }
    
    if(password !== confirmPassword){ //if password and confirm password not match for login
        return next(new ErrorHandler("Password does not matched!",400)); 
    }
    
    const user = await User.findOne({email}).select("+password"); // find user by email and select is use for get password because in schema file we apply select:false
    
    if(!user){ //if any user are get or exist then
        return next(new ErrorHandler("Invalid password or email!",400));
    }
    
    const isPasswordMatched = await user.comparePassword(password); //we create the compare fucnction in userSchema.js that compare the entered password and dbhashed password
    
    if(!isPasswordMatched){ // if password not match in database
        return next(new ErrorHandler("Invalid password or email!",400));
    }
    
    // if selected role is not match
    if(role !== user.role){
        return next(new ErrorHandler("User with this role is not found!",400));
    }
    
    // send successfull msg to user that user is registered
    // res.status(200).json({
    //         success:true,
    //         message:"User Login Successfully!",
    // })

    // this function is use for generate token which discribe in "utiles/generateToken" and this use as place of above successfull code
    generateToken(user, "User Login Successfully!", 200, res);
        
})

// add new admin
export const addNewAdmin = catchAsyncError(async(req,res,next) => {
    
    const {firstName, lastName, email, phone, password, nic, dob, gender } = req.body; // get data from req body
    
    if(!firstName || !lastName || !email || !phone || !password|| !nic || !dob || !gender ){ //if any daya can't get
        return next(new ErrorHandler("Please Fill Full Form!",400));
    }

    const isRegistered = await User.findOne({email}) // find user is already exist in db or not

    if(isRegistered){ //if any user are get or exist then
        return next(new ErrorHandler(`${isRegistered.role} with this Email is Already Exists!`,400));
    }

    const admin = await User.create({ // create new user
        firstName,
        lastName, 
        email, 
        phone, 
        password, 
        nic, 
        dob, 
        gender, 
        role:"Admin",
    });


    // res.status(200).json({
    //         success:true,
    //         message:"New Admin Registered!",
    //     })

    generateToken(admin, "New Admin Registered!", 200, res);

})

// get all doctor form database
export const getAllDoctor = catchAsyncError(async(req,res,next) => {
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    })
})

// get user deatil form current req body and user may be doctor, patient or admin
export const getUserDetail = catchAsyncError(async(req,res,next) => {
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    });
})


// create saprate route for logout due to token is assign with different named +patient token +doctor token +admin token 


// use for logout the admin by removing the jwt token
export const logoutAdmin = catchAsyncError(async (req,res,next) => {
    res
    .status(200)
    .cookie("adminToken","",{     //Clearing the Cookie by set empty value of "adminToken"
        httpOnly:true,      // use for security purpose and this help to hide cookie info from client side and only get cookie from http request
        expires:new Date(Date.now())
    })
    .json({
        success:true,
        message:"Admin Logged Out Successfully!"
    });
})

// use for logout the patient by removing the jwt token
export const logoutPatient = catchAsyncError(async (req,res,next) => {
    res
    .status(200)
    .cookie("patientToken","",{     //Clearing the Cookie by set empty value of "patientToken"
        httpOnly:true,      // use for security purpose and this help to hide cookie info from client side and only get cookie from http request
        expires:new Date(Date.now())
    })
    .json({
        success:true,
        message:"Patient Logged Out Successfully!"
    });
})

// add new doctor
export const addNewDoctor = catchAsyncError(async(req,res,next) => {

    if(!req.files || Object.keys(req.files).length === 0){//if no any object or data present in req.files objects means no file wwill uploades
        return next(new ErrorHandler("Doctor Avatar Required!",400));
    }
    
    const {docAvatar} = req.files; //extract docVavtar file from uploads
    
    const allowedFormates = ["image/jpeg", "image/png", "image/webp"]; // formate allowed to upload 
    
    if(!allowedFormates.includes(docAvatar.mimetype)){  //to check the uploaded file is matched to allowed formate or not
        return next(new ErrorHandler("Image formate not allowed!",400));
    }
    
    const {firstName, lastName, email, phone, password, nic, dob, gender, doctorDepartment } = req.body; // get data from req body
    
    if(!firstName || !lastName || !email || !phone || !password|| !nic || !dob || !gender ){ //if any daya can't get
        return next(new ErrorHandler("Please Fill Full Form!",400));
    }
    
    // in this isRegistered variable, there are store the user
    const isRegistered = await User.findOne({email}) // find user is already exist in db or not
    
    if(isRegistered){ //if any doctor is already gets or exist then return error
        return next(new ErrorHandler(`${isRegistered.role} with this Email is Already Exists!`,400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath); // after upload the file on cloudnary, 
 
    // console.log(cloudinaryResponse); 
    // some output of cloudnary respponse
    // {
        // asset_id: '88a00f7aafa2ebe750078d7533334f03',
        // public_id: 'rt83ee40dscwgxj0cn8f',
        // version: 1716459144,
        // version_id: 'e9cce924cae63d2f05a64eb92add4e4a',
        // signature: '68aa9e0852fe549381bd2951436db4da0717f554',
        // width: 740,
        // height: 731,
        // format: 'jpg',
        // resource_type: 'image',
        // created_at: '2024-05-23T10:12:24Z',
        // tags: [],
        // bytes: 56372,
        // type: 'upload',
        // etag: 'ebf8ac145fbcbe2ac0b5c00a5f0753f9',
        // placeholder: false,
        // url: 'http://res.cloudinary.com/dpaqk4g3o/image/upload/v1716459144/rt83ee40dscwgxj0cn8f.jpg',
        // secure_url: 'https://res.cloudinary.com/dpaqk4g3o/image/upload/v1716459144/rt83ee40dscwgxj0cn8f.jpg',
        // folder: '',
        // original_filename: 'tmp-1-1716459141953',
        // api_key: '374192844155437'
        // }

    if(!cloudinaryResponse || cloudinaryResponse.error){    //if no cloudnary response or any error from cloudnary in response
        console.log("Cloudnary Error : ", cloudinaryResponse.error || "Unknown Cloudnary Error!")
    }
    
    const doctor = await User.create({ // create new doctor
        firstName,
        lastName, 
        email, 
        phone, 
        password, 
        nic, 
        dob, 
        gender, 
        doctorDepartment,
        role:"Doctor",
        docAvatar:{
            public_id:cloudinaryResponse.public_id, 
            url:cloudinaryResponse.secure_url
        }
    });

    res.status(200).json({
            success:true,
            message:"New Doctor Registered!",
            doctor
    })
})