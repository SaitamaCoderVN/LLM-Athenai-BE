import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import messageRoute from "./routes/message";
import confirmRoute from "./routes/confirm";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use(messageRoute);
app.use(confirmRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
