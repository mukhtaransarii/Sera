import "dotenv/config"
import express from "express";
const app = express();
import cookieParse from 'cookie-parser'
import { connectDd } from './config/db'

import chatRoutes from "./routes/chat";
import cors from 'cors'
import userRouter from './routes/user'

connectDd();
app.use(express.json());
app.use(cookieParse())

const allowed = ["http://localhost:5173","https://sera-blue.vercel.app"];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (allowed.includes(origin)) return cb(null, origin)
    return cb(new Error("Not allowed by CORS"))
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // 👈 add this
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: [
    "x-ratelimit-limit-requests",
    "x-ratelimit-limit-tokens",
    "x-ratelimit-remaining-requests",
    "x-ratelimit-remaining-tokens",
    "x-ratelimit-reset-requests",
    "x-ratelimit-reset-tokens"
  ]
}))

app.get("/", (req, res) => res.json({msg: "Ai server res active"}));
app.use('/auth', userRouter)
app.use("/api", chatRoutes);

export default app; // for vercel

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Running on http://localhost:3000'));
}
