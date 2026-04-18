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
  origin: (o, cb) => cb(null, !o || allowed.includes(o)),
  credentials: true
}));

app.get("/", (req, res) => res.json({msg: "Ai server res active"}));
app.use('/auth', userRouter)
app.use("/api", chatRoutes);

export default app; // for vercel

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Running on http://localhost:3000'));
}