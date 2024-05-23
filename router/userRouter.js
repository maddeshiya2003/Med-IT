import express from "express"
import {addNewAdmin, login,patientRegister,getAllDoctor, getUserDetail, logoutAdmin, logoutPatient, addNewDoctor} from "../controller/userController.js"

import {isAdminAuthenticated,isPatientAuthenticated,isDoctorAuthenticated} from "../middleware/auth.js"

const router = express.Router();

// doctor route banane hai sare
router.post("/doctor/addnew",isAdminAuthenticated, addNewDoctor);  // routes for add new doctor
// router.get("/doctor/me", isDoctorAuthenticated, getUserDetail);   // routes for get doctor detail

router.post("/patient/register", patientRegister);  // routes for registration of patients
router.post("/login", login);   // routes for user (patient, doctor, admin) login
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin); // routes for only admin can add new admin
router.get("/doctors", getAllDoctor);   // get all doctors detail
router.get("/admin/me",isAdminAuthenticated, getUserDetail); // routes for get patient detail
router.get("/patient/me", isPatientAuthenticated, getUserDetail);   // routes for get patient detail
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);   // routes for logout admin
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);   // routes for logout patient

export default router;