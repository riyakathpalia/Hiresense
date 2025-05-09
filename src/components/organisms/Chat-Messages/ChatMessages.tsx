"use client"

import { Box, styled } from "@mui/material"
import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import MessageBubble from "@/components/molecules/Message-Bubble/MessageBubble"
import TypingIndicator from "@/components/atoms/typing-indicator/TypingIndicator"
import type { MessageType } from "@/types/Chat"

const MessagesContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    overflowY: "auto",
    flexGrow: 1,
    border: 1
}))

// const ConversationHeader = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: theme.spacing(2),
//   borderBottom: `1px solid ${theme.palette.divider}`,
// }))

//const MotionTypography = motion(Typography)

interface ChatMessagesProps {
    messages: MessageType[]
    isTyping: boolean
    conversationTitle?: string
}

export default function ChatMessages({
    messages,
    isTyping,
    //conversationTitle = "New Conversation",
}: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages change or when typing starts/stops
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* <ConversationHeader>
        <MotionTypography
          variant="h6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {conversationTitle}
        </MotionTypography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "text.secondary",
              }}
            >
              <HistoryIcon fontSize="small" sx={{ mr: 0.5 }} /> History
            </Typography>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              <ChatIcon fontSize="small" sx={{ mr: 0.5 }} /> New Chat
            </Typography>
          </motion.div>
        </Box>
      </ConversationHeader> */}

            <MessagesContainer>
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 500 }}
                        >
                            <MessageBubble
                                content={message.ChatResponse}
                                timestamp={message.timestamp}
                                isUser={message.isUser}
                                isTyping={message.isTyping}
                                isBackendResponse={true}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <Box sx={{ alignSelf: "flex-start", mb: 2 }}>
                        <TypingIndicator />
                    </Box>
                )}

                <div ref={messagesEndRef} />
            </MessagesContainer>
        </Box>
    )
}
