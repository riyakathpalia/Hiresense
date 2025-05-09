// export interface Message {
//     id: string
//     role: "user" | "assistant" | "system"
//     content: string
//     timestamp: Date
//     isTyping?: boolean
//   }


export interface MessageType {
    id: string;
    ChatResponse: string;
    isUser: boolean;
    timestamp: Date;
    isTyping?: boolean
}
