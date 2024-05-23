import app from "./app.js";

import cloudinary from "cloudinary";


// setup cloudnary for save images for get link of that image
cloudinary.v2.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT,() => {
    console.log(`Listen at port no ${process.env.PORT}`);
});
