import { envConfig } from "../constants/config";
import clientPromise from "../lib/mongodb";
import { sendMessage } from "../services/openaiService";
import express, { Request, Response } from "express";

const router = express.Router();

/**
 * @swagger
 * /process:
 *   post:
 *     summary: Process a message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *               - maxTokens
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *               maxTokens:
 *                 type: number
 *               userAddress:
 *                 type: string
 *               txHash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message processed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/process", async (req: Request, res: Response): Promise<any> => {
  try {
    const { messages, maxTokens, userAddress, txHash } = req.body;

    if (!messages || !maxTokens) {
      return res.status(400).json({ 
        error: "messages and maxTokens are required." 
      });
    }

    const response = await sendMessage({ messages, maxTokens });
    console.log("Message processed successfully", messages);

    const client = await clientPromise;
    const db = client.db(envConfig.DB_NAME);

    const userMessage = {
      content: messages[messages.length - 1].content,
      role: "user",
      timestamp: new Date(),
      userAddress: userAddress,
      isWin: response.decision === true,
      isConfirmed: false,
      txHash: txHash,
    };
    await db
      .collection(envConfig.DB_MESSAGES_COLLECTION)
      .insertOne(userMessage);

    const aiMessage = {
      content: response.explanation,
      role: "assistant",
      timestamp: new Date(),
      isConfirmed: false,
      txHash: txHash,
    };
    await db.collection(envConfig.DB_MESSAGES_COLLECTION).insertOne(aiMessage);

    return res.json(response);
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json(
      { error: "An error occurred while saving the message." },
    );
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all confirmed messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of confirmed messages
 *       500:
 *         description: Server error
 */
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const client = await clientPromise;
    const db = client.db(envConfig.DB_NAME);

    const messages = await db
      .collection(envConfig.DB_MESSAGES_COLLECTION)
      .find({ isConfirmed: true })
      .toArray();

    return res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json(
      { error: "An error occurred while fetching messages." },
    );
  }
});

export default router;
