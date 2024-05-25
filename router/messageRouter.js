import express from "express"
import { getAllMessage, sendMessage } from "../controller/messageController.js";
import {isAdminAuthenticated} from "../middleware/auth.js"

const router = express.Router();

router.post("/send",sendMessage); //routes for post the messages
router.get("/getallmessage",isAdminAuthenticated,getAllMessage);    //routes for get all messages and admin only can gett all the message

export default router;