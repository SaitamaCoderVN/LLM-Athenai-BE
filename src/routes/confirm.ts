import { envConfig } from "../constants/config";
import clientPromise from "../lib/mongodb";
import express, { Request, Response } from "express";

const router = express.Router();

/**
 * @swagger
 * /confirm:
 *   post:
 *     summary: Confirm messages using txHash
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txHash
 *             properties:
 *               txHash:
 *                 type: string
 *                 description: Transaction hash to confirm
 *     responses:
 *       200:
 *         description: Confirmation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Missing txHash
 *       500:
 *         description: Server error
 */
router.post("/confirm", async (req: Request, res: Response): Promise<any> => {
  try {
    const { txHash } = req.body;

    if (!txHash) {
      return res.status(400).json({ 
        error: "txHash is required." 
      });
    }

    const client = await clientPromise;
    const db = client.db(envConfig.DB_NAME);

    // Update all messages with matching txHash
    await db.collection(envConfig.DB_MESSAGES_COLLECTION).updateMany(
      {
        txHash: txHash,
        isConfirmed: false,
      },
      { $set: { isConfirmed: true } }
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("Error updating confirmed state:", error);
    return res.status(500).json({ 
      error: "An error occurred while updating confirmed state." 
    });
  }
});

export default router;
