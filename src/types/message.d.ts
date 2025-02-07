export interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}
  
export interface StructuredMessage {
  explanation: string;
  decision: boolean;
}

export interface SendMessageOptions {
  messages: Message[];
  maxTokens?: number;
}
  