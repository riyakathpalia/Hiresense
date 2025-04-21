"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  TextField,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { styled } from "@mui/system";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%", // Changed from 100vh to fit within the layout
  maxWidth: "100%", // Adjusted max width
  margin: "0 auto",
  padding: "16px",
  flexGrow: 1, // Make it grow within the parent
});

const MessageList = styled("div")({
  flex: 1,
  overflowY: "auto",
  padding: "8px",
});

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ isUser, theme }) => ({
  maxWidth: "75%",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[300],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? "flex-end" : "flex-start",
  margin: "4px 0",
}));

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! How can MetProAi assist you today?", isUser: false, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        content: "This is a placeholder response from MetProAi.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([...updatedMessages, aiResponse]);
    }, 1000);
  };

  return (
    <ChatContainer>
      <Typography variant="h6" gutterBottom>
        Chat with MetProAi
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <MessageList>
        {messages.map((message) => (
          <MessageBubble key={message.id} isUser={message.isUser}>
            <Typography variant="body2">{message.content}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <Divider sx={{ mt: 2 }} />
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

export default ChatPage;