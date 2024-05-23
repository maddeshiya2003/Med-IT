import express from "express"
import { getAllMessage, sendMessage } from "../controller/messageController.js";
import {isAdminAuthenticated} from "../middleware/auth.js"

const router = express.Router();

router.post("/send",sendMessage);
router.get("/getallmessage",isAdminAuthenticated,getAllMessage);

export default router;