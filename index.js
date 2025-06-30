import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
import http from "http";
import candidateRoutes from "./routes/candidateRoutes.js";
import interviewerRoutes from "./routes/interviewerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import corporateRoutes from "./routes/corporateRoutes.js";
import slackRoutes from "./routes/slackRoutes.js";
import { broadcastMessage, initializeWebSocket } from "./utils/websocket.js";
import authRoutes from "./routes/authRoutes.js";
import requestDemoRoutes from "./routes/requestDemoRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/candidate", candidateRoutes);
app.use("/interviewer", interviewerRoutes);
app.use("/admin", adminRoutes);
app.use("/corporate", corporateRoutes);
app.use("/slack", slackRoutes);
app.use('/auth', authRoutes);
app.use('/demo', requestDemoRoutes);


const server = http.createServer(app);

const wss = initializeWebSocket(server);

global.broadcastMessage = (message) => broadcastMessage(wss, message);


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  }
};

startServer();
