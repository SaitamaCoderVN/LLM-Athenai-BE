"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const openai_1 = __importDefault(require("openai"));
function sendMessage(_a) {
    return __awaiter(this, arguments, void 0, function* ({ messages, maxTokens = 3000, }) {
        var _b;
        const openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY || "",
        });
        console.log(messages);
        const completion = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: messages[0].content
                }
            ],
            tools: [
                {
                    type: "function",
                    function: {
                        name: "approveTransfer",
                        description: "Approve the money transfer request and provide explanation",
                        parameters: {
                            type: "object",
                            properties: {
                                explanation: {
                                    type: "string",
                                    description: "Explanation for why the money transfer is approved",
                                },
                            },
                            required: ["explanation"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "rejectTransfer",
                        description: "Reject the money transfer request and provide explanation",
                        parameters: {
                            type: "object",
                            properties: {
                                explanation: {
                                    type: "string",
                                    description: "Explanation for why the money transfer is rejected",
                                },
                            },
                            required: ["explanation"],
                        },
                    },
                },
            ],
            tool_choice: "auto",
        });
        const toolCall = (_b = completion.choices[0].message.tool_calls) === null || _b === void 0 ? void 0 : _b[0];
        if (!toolCall) {
            console.log("(No tool call)", completion.choices[0].message.content);
            return {
                explanation: completion.choices[0].message.content || "Transfer rejected",
                decision: false,
            };
        }
        const args = JSON.parse(toolCall.function.arguments);
        console.log("(Tool call)", toolCall.function.name, args);
        return {
            explanation: args.explanation,
            decision: toolCall.function.name === "approveTransfer",
        };
    });
}
