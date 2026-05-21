import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import aiInterviewRoutes from "./routes/aiInterviewRoutes.js";
import paymentRouter from "./routes/payment.route.js";
import http from "http";
import { Server } from "socket.io";
import setupSockets from "./sockets.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  },
  transports: ["websocket", "polling"],
  maxHttpBufferSize: 1e6,
  perMessageDeflate: {
    threshold: 1024,
  },
});

// Mount all socket logic from dedicated module
setupSockets(io);

const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai-interview", aiInterviewRoutes);
app.use("/api/payment", paymentRouter);

server.listen(port, () =>
  console.log(`Server + Socket running on port : ${port}`)
);