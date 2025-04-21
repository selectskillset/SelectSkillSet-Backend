import express from "express";
import { requestDemo } from "../controller/requestDemoController.js";

const requestDemoRoutes = express.Router();

requestDemoRoutes.post("/add-request-demo", requestDemo);

export default requestDemoRoutes;
