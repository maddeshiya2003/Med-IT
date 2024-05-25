import express from "express";
import {deleteAppointment, getAllAppointment, postAppointment, updateAppointmentStatus} from "../controller/appointementController.js";
import {isPatientAuthenticated,isAdminAuthenticated, isDoctorAuthenticated} from "../middleware/auth.js"

const router = express.Router();

// book appointment
router.post("/post", isPatientAuthenticated, postAppointment);  // only book by patient 

// get all appointment 
router.get("/getall", isAdminAuthenticated, getAllAppointment); // add isDoctorAuthenticated middleware in furture

// routes for update the status of appointment from pending to accepted or rejected or again pending 
router.put("/updatestatus/:id", isAdminAuthenticated, updateAppointmentStatus); // add isDoctorAuthenticated middleware in furture

// route for delete the appointment 
router.delete("/deleteappointment/:id", isAdminAuthenticated, deleteAppointment); // add isDoctorAuthenticated middleware in furture

export default router;