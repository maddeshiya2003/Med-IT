// this generateToken function take user info, message which render on user,
//  status code ans requset api from which route, the request comes 

// it takes 4 parameters 1) user : which user is generate token 
                     //  2) message : 
                     //  3) statusCode : 
                     //  4) res :
export const generateToken = (user, message, statusCode, res) => {

    const token = user.generateJsonWebToken(); // use to generate token and this function define in user schema tha why user variable has access of that function

    let cookieName = "patientToken"; // variable for token name and has already name for patient thats why we noot check for patient
    if(user.role === "Admin")   cookieName="adminToken"; //if user is admin
    else if(user.role === "Doctor") cookieName="doctorToken"; //if user is doctor


    // send response to client that is status code, cookie and json file
    res.status(statusCode).cookie(cookieName,token,{
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES *24*60*60*1000
        ),
        httpOnly:true,  // use for security purpose and this help to hide cookie info from client side and only get cookie from http request
    })
    .json({
        success:false,
        message,
        user,
        token,
    });

}