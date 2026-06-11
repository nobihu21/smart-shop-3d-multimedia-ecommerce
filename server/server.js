import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", (req, res) => {
  // dummy AI logic simulation
  setTimeout(() => {
    res.json({ message: "AI analysis complete – outfit matches perfectly!" });
  }, 2000);
});

app.listen(5000, () => console.log("Server running on port 5000"));
