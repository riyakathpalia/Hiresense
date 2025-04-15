"use client"
import React, { useState } from "react";
import {
  Typography,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { styled } from "@mui/system";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  maxWidth: "900px",
  margin: "auto",
  padding: "16px",
});

const MessageList = styled("div")({
  flex: 1,
  overflowY: "auto",
  padding: "8px",
});

const MessageBubble = styled("div")<{ isUser: boolean }>(({ isUser }) => ({
  maxWidth: "75%",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: isUser ? "#1976d2" : "#e0e0e0",
  color: isUser ? "#ffffff" : "#000000",
  alignSelf: isUser ? "flex-end" : "flex-start",
  margin: "4px 0",
}));

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! How can I help you?", isUser: false, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a placeholder AI response.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([...updatedMessages, aiResponse]);
    }, 1000);
  };

  return (
    <ChatContainer>
      <Typography variant="h5" gutterBottom>
        Chat with AI
      </Typography>
      <Divider />
      <MessageList>
        {messages.map((message) => (
          <MessageBubble key={message.id} isUser={message.isUser}>
            <Typography variant="body2">{message.content}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          </MessageBubble>
        ))}
      </MessageList>
      <Divider />
      <form onSubmit={handleSendMessage} style={{ display: "flex", padding: "8px" }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <IconButton type="submit" color="primary" disabled={!input.trim()}>
          <Send />
        </IconButton>
      </form>
    </ChatContainer>
  );
};


