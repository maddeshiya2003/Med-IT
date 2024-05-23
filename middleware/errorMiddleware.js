// their exist a Error class in javascript 
// this whole ode is use for defining the custom class

class ErrorHandler extends Error{ // here create custom ErrorHandler class that inherit property of inbuild Error class 
    constructor(message,statusCode){  
        super(message); // used to call the parent class with message parameter
        this.statusCode = statusCode // code associated with HTTP request
    }
}


// this discription taken from ChatGPT for code of Class Error code **************

// Yeh code ek custom error class ErrorHandler ko define karta hai jo JavaScript mein built-in Error class ko extend karta hai. Har hisse ka samjhaav hai:

// class ErrorHandler extends Error: Yeh line ek naya class ErrorHandler define karta hai jo JavaScript mein built-in Error class par based hai. Yeh yeh batata hai ki ErrorHandler Error class ke saare features ko inherit karega aur usme apne khud ke features bhi ho sakte hain.

// constructor(message, statusCode): Yeh ek special method hai jo constructor ke naam se jaana jaata hai. Jab aap ek naya ErrorHandler object banate hain, yeh method khud hi call hota hai. Isme do parameters hote hain:

// message: Ek string jo error message ko represent karta hai.
// statusCode: Ek number jo error ke saath jude HTTP status code ko represent karta hai.
// super(message): Yeh line parent class (Error) ka constructor call karta hai message parameter ke saath. Yeh ErrorHandler instance ke liye error message set karta hai.

// this.statusCode = statusCode: Yeh line ErrorHandler instance ka statusCode property ko constructor mein diye gaye statusCode parameter ke value se set karta hai. Isse aap error ke saath ek HTTP status code ko associate kar sakte hain.


// **********----------------------------------------------------------------------------------------------------------------**************************************************************

// this is error middleware which runs when the any request has some error
export const errorMiddleware = (err,req,res,next) => {

    // if no any message in request and error comes then this set to "Interval Sever Error" 
    // and also set status code to 500
    err.message=err.message || "Interval Sever Error"; 
    err.statusCode=err.statusCode || 500;


    // if database are give error of duplication on value that is unique then code of the error is 11000
    if(err.code === 11000){ 
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered.`;
        err = new ErrorHandler(message,400); //set new error to this and replace the existing wala.
    }

    // if json token is invalid
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, Try again`;
        err = new ErrorHandler(message,400); //set new error to this and replace the existing wala.
    }

    // if json token gets expire
    if(err.name === "TokenExpireError"){
        const message = `Json Web Token is expired, Try again`;
        err = new ErrorHandler(message,400); //set new error to this and replace the existing wala.
    }

    
    // any type error of input field like if their a number but you entered string
    if(err.name === "CastError"){
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message,400); //set new error to this and replace the existing wala.
    }

    //below line is use for only get msg not for key value pair
    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map(error => error.message)
            .join(" ") 
        : err.message; // "Object.values(err.errors)" ka istemal karke aap err.errors se saare error objects values ko ek array mein convert kar raha

    // why we return this :------- because of send to client and also to terminate the further execution of the request-response cycle
    // also we necessory to return because of asyncronous operation
    return res.status(err.statusCode).json({
        success:false,
        message : errorMessage,
    })
}

export default ErrorHandler;