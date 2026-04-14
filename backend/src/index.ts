import "dotenv/config";
import express from "express";
import "dotenv/config";
import chatRoutes from "./routes/chat";
import cors from 'cors'

const app = express();
app.use(cors({
  origin: "*", // for testing only
}));
app.use(express.json());

app.get("/", (req, res) => res.json({msg: "Ai server res active"}));
app.use("/api", chatRoutes);

export default app; // for vercel

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Running on http://localhost:3000'));
}