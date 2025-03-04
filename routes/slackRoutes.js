import express from "express";
import { handleSlackEvents, sendMessageToSlack } from "../controller/slackController.js";
import { verifySlackRequest } from "../middleware/verifySlackRequest.js";

const slackRoutes = express.Router();

slackRoutes.post("/send-message",  sendMessageToSlack);
slackRoutes.post("/events",verifySlackRequest,  handleSlackEvents);

export default slackRoutes;
