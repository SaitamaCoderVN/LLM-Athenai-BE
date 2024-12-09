import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import messageRoute from "./routes/message";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Routes
app.use(messageRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
