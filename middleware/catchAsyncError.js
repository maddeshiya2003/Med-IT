// this is utility function that is use for handlig the asyncronous error
export const catchAsyncError = (thisFunction) => {
    return (req,res,next) => {
        Promise.resolve(thisFunction(req,res,next)).catch(next); // execute thisFunction with req,res and next parameter and their is no error the send control to next middleware else if any error the send contorl with error to next middleware
    }
}


// this discription taken from ChatGPT

// export const catchAsyncError = (thisFunction) => {: Yeh line ek function ko export karta hai jiska naam hai catchAsyncError. Ye function ek aur function ko parameter ke roop mein leta hai, jise thisFunction kaha jata hai. thisFunction ek asynchronous function hona chahiye jo execute kiya jayega.

//     return (req, res, next) => {: Yeh line ek aur function ko return karta hai, jo ki Express.js application mein middleware ke roop mein kaam karta hai. Ye middleware function teen parameters leta hai: req (request), res (response), aur next, jo request-response cycle mein agle middleware ko control transfer karne ke liye ek callback function hai.
    
//     Promise.resolve(thisFunction(req, res, next)).catch(next);: Yeh line thisFunction ko asynchronous tareeke se execute karta hai diye gaye req, res, aur next parameters ke saath. Ye thisFunction ko Promise.resolve() call ke andar wrap karta hai, jo ensure karta hai ki thisFunction hamesha ek promise return karta hai. Agar promise successfully resolve hoti hai (yaani koi error nahi hai), toh kuch nahi hota aur control agle middleware mein chala jata hai. Lekin, agar promise reject hoti hai (yaani koi error hai), toh catch() method error ko pakad leti hai, aur next() ko error ke saath call kiya jata hai. Yeh error ko Express error handling middleware mein pass karta hai.