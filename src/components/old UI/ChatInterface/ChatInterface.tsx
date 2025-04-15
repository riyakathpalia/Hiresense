import React, { useState, useRef, useEffect } from "react";
import { TextField, Box, Paper, IconButton, Typography, CircularProgress } from "@mui/material";
import { Send, Refresh } from "@mui/icons-material";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  selectedCVId?: string;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedCVId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I've analyzed your CV. How can I help you with it today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I've analyzed this CV and found several relevant skills including data analysis, project management, and communication. Would you like more specific information?",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.map((message) => (
          <Paper
            key={message.id}
            sx={{
              maxWidth: "80%",
              p: 2,
              mb: 1,
              alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
              bgcolor: message.sender === "user" ? "primary.main" : "grey.300",
              color: message.sender === "user" ? "primary.contrastText" : "text.primary",
            }}
          >
            <Typography>{message.content}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 1 }}>
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          </Paper>
        ))}

        {isTyping && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="primary" />
            <Typography variant="body2">Typing...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about this CV..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          minRows={1}
          maxRows={4}
        />
        <IconButton color="secondary">
          <Refresh />
        </IconButton>
        <IconButton color="primary" onClick={handleSendMessage} disabled={!input.trim()}>
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInterface;
