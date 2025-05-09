"use client"

import { Box, Paper, styled } from "@mui/material"
import { motion } from "framer-motion"
import MessageContent from "../Message-Content/MessageContent"
import MessageTimestamp from "@/components/atoms/message-timestamp/MessageTimestamp"

interface MessageBubbleProps {
  content: string
  timestamp: Date
  isUser: boolean
  isTyping?: boolean
  isBackendResponse?: boolean
}

const MessageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isUser",
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: isUser ? "flex-end" : "flex-start",
  maxWidth: "80%",
  alignSelf: isUser ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(2),
}))

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isUser",
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  backgroundColor: isUser ? theme.palette.DodgerBlue.main : theme.palette.BlueMirage.main,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: isUser ? theme.spacing(2, 2, 0, 2) : theme.spacing(2, 2, 2, 0),
  maxWidth: "100%",
}))

const MotionPaper = motion(StyledPaper)

export default function MessageBubble({ content, timestamp, isUser, isTyping = false, isBackendResponse = false, }: MessageBubbleProps) {
  return (
    <MessageContainer isUser={isUser}>
      <MotionPaper
        isUser={isUser}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <MessageContent content={content} isTyping={isTyping && !isUser} isBackendResponse={isBackendResponse}/>
      </MotionPaper>
      <MessageTimestamp timestamp={timestamp} />
    </MessageContainer>
  )
}
