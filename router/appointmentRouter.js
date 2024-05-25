import express from "express";
import {deleteAppointment, getAllAppointment, postAppointment, updateAppointmentStatus} from "../controller/appointementController.js";
import {isPatientAuthenticated,isAdminAuthenticated, isDoctorAuthenticated} from "../middleware/auth.js"

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointment); // add isDoctorAuthenticated middleware in furture
router.put("/updatestatus/:id", isAdminAuthenticated, updateAppointmentStatus); // add isDoctorAuthenticated middleware in furture
router.delete("/deleteappointment/:id", isAdminAuthenticated, deleteAppointment); // add isDoctorAuthenticated middleware in furture

export default router;