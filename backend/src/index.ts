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

app.listen(process.env.PORT, () => console.log("Server running on port 3000"));