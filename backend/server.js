import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import paymentRouter from "./routes/paymentRoute.js";
import authRouter from './routes/authRoute.js'
import reviewRouter from "./routes/reviewRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/review", reviewRouter)

app.listen(port, async () => {
  await connectDb();
  console.log(`Server running at http://localhost:${port}`);
});
