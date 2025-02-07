Description
 # LLM-Driven Challenge Response

## Transaction Confirmation

Upon confirmation of the transaction on-chain, the backend system:
1. **Retrieves** the challenge prompt and user wallet address from the associated blockchain event.
2. **Sends** this data to an integrated LLM (Language Model) for evaluation via a secure API call.
3. **Logs** the transaction confirmation and the prompt details for auditing and debugging purposes.

## LLM Response

The LLM processes the prompt and returns the following outputs:
- **Text**: A detailed message or explanation of the decision.
- **Action**: One of the following:
  - `ApproveTransfer`: Approves the transfer of prize funds, signaling that the user's attempt was valid and successful.
  - `RejectTransfer`: Rejects the transfer request, indicating that the user's attempt failed or did not meet the challenge criteria.

## Action Processing

The backend system processes the action returned by the LLM:

### If `RejectTransfer`:
- The system sends a Telegram message to the user containing:
  - The LLM response text as feedback or justification.
  - Suggestions or hints (if applicable) to encourage further attempts.
- Records the rejection event in the database for metrics and user performance tracking.

### If `ApproveTransfer`:
- The backend triggers a secure transaction to transfer the **Prize Funds** from the **prize pool wallet** to the user's wallet address.
- Notifies the user via Telegram about the successful transfer with a confirmation message and transaction ID.
- Updates the leaderboard or reward tracking system to reflect the user's success.


Reference issue
- #287 

Category
- DeFi
