import mongoose from "mongoose";

// stablish connection with mongoatlas
export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_DB_URI,{ // locally setup
        dbName:"MED-IT"
    }).then(() => {
        console.log("Database connection successfully!")
    }).catch((err) => {
        console.log(`Some Error Occure : ${err}`)
    });
}