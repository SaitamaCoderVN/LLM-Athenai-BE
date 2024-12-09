import express, { Request, Response } from "express";
import { sendMessage } from "../services/openaiService";

const handler = express.Router();

handler.post("/process", async (req: Request, res: Response): Promise<any>=> {
   try {
    // Retrieve data from body
    const { messages, maxTokens } = req.body;

    // // Validate
    // if (!messages || !Array.isArray(messages)) {
    //   return res.status(400).json({ error: "'messages' must be an array." });
    // }

    // Call your logic processing function
    const response = await sendMessage({ messages, maxTokens });

    // Return the result
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
});

export default handler;
