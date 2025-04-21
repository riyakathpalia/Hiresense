import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, History, Message, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  useTheme,
  Paper,
  CircularProgress
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useWorkspace } from '@/context/WorkspaceContext';
import WorkspaceSelector from '../Workspace-Selector/WorkspaceSelector';
import CustomButton from '@/components/atoms/button/CustomButton';
import { ChatApi } from '@/lib/api/chatApi';

interface MessageType {
  id: string;
  ChatResponse: any;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages: MessageType[];
}

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  console.warn('crypto.randomUUID not available, using fallback ID generation.');
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

interface WorkspaceChatProps {
  aiResponse?: string | null;
}

const WorkspaceChat: React.FC<WorkspaceChatProps> = ({ aiResponse }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { activeWorkspace } = useWorkspace();
  const theme = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (activeWorkspace?.name) {
      setMessages([
        {
          id: createId(),
          ChatResponse: `Hello! I'm your assistant for the "${activeWorkspace.name}" workspace. How can I help you today?`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          id: createId(),
          ChatResponse: `Hello! I'm your assistant. How can I help you today?`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (aiResponse) {
      const aiMessage: MessageType = {
        id: createId(),
        ChatResponse: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }
  }, [aiResponse]);

  const sendChatMessage = useCallback(async (message: string, isJdSearch: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await ChatApi.sendMessage(message);
      return response.data?.reply || {};
    } catch (error) {
      console.error('Error sending message:', error);
      enqueueSnackbar('Failed to send message', { variant: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: MessageType = {
      id: createId(),
      ChatResponse: input,
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const jdSearch = activeWorkspace?.type === 'jd' || false;
      const aiReply = await sendChatMessage(userMessage.ChatResponse, jdSearch);

      const aiResponse: MessageType = {
        id: createId(),
        ChatResponse: aiReply,
        isUser: false,
        timestamp: new Date(),
      };

      const newMessages = [...updatedMessages, aiResponse];
      setMessages(newMessages);

      if (!activeChatId) {
        const newChatId = createId();
        const newChat: ChatHistory = {
          id: newChatId,
          title: userMessage.ChatResponse.slice(0, 30) + (userMessage.ChatResponse.length > 30 ? '...' : ''),
          preview: userMessage.ChatResponse.slice(0, 50) + (userMessage.ChatResponse.length > 50 ? '...' : ''),
          timestamp: new Date(),
          messages: newMessages,
        };

        setChatHistories((prev) => [newChat, ...prev]);
        setActiveChatId(newChatId);
        enqueueSnackbar('Chat saved', {
          variant: 'success',
          autoHideDuration: 2000,
        });
      } else {
        setChatHistories((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: newMessages, timestamp: new Date() } : chat
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: MessageType = {
        id: createId(),
        ChatResponse: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, errorMessage]);
      enqueueSnackbar('Failed to get response from assistant', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: createId(),
        ChatResponse: `Hello! I'm your assistant for the "${activeWorkspace?.name || 'Current'}" workspace. How can I help you today?`,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setActiveChatId(null);
  };

  const loadChatHistory = (chatId: string) => {
    const chat = chatHistories.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setActiveChatId(chatId);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'summarize':
        if (activeWorkspace?.type === 'resume' && activeWorkspace?.filePath) {
          if (typeof activeWorkspace.filePath === 'string') {
            handleSummaryRequest(activeWorkspace.filePath);
          } else {
            enqueueSnackbar('The file path is not valid or missing.', { variant: 'error' });
          }
        } else {
          enqueueSnackbar('Please select a resume file first', { variant: 'error' });
        }
        break;
      case 'match':
        if (activeWorkspace?.type === 'resume') {
          setInput('Find job matches for this resume');
        } else if (activeWorkspace?.type === 'jd') {
          setInput('Find candidate matches for this job');
        }
        break;
      default:
        break;
    }
  };

  const handleSummaryRequest = async (filePath: string) => {
    const userMessage: MessageType = {
      id: createId(),
      ChatResponse: 'Generate a summary of this resume',
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const aiReply = await sendChatMessage(`Generate a summary of the resume at: ${filePath}`);

      const summaryResponse: MessageType = {
        id: createId(),
        ChatResponse: aiReply || "No summary available",
        isUser: false,
        timestamp: new Date(),
      };

      const newMessages = [...updatedMessages, summaryResponse];
      setMessages(newMessages);

      if (!activeChatId) {
        const newChatId = createId();
        const newChat: ChatHistory = {
          id: newChatId,
          title: 'Resume Summary',
          preview: 'Generated summary of resume',
          timestamp: new Date(),
          messages: newMessages,
        };

        setChatHistories((prev) => [newChat, ...prev]);
        setActiveChatId(newChatId);

        enqueueSnackbar('Summary generated', {
          variant: 'success',
          autoHideDuration: 2000,
        });
      } else {
        setChatHistories((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: newMessages, timestamp: new Date() } : chat
          )
        );
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage: MessageType = {
        id: createId(),
        ChatResponse:
          'Sorry, I encountered an error generating the summary. Please make sure the file is accessible.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, errorMessage]);
      enqueueSnackbar('Failed to generate resume summary', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          height: '100%',
          border: 1,
          borderRadius: 2,
          borderColor: 'divider',
        }}
      >
        {showHistory && (
          <Card sx={{ width: '25%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 2, flex: 1, overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">Recent Conversations</Typography>
                <IconButton onClick={() => setShowHistory(false)} size="small">
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 'calc(100vh - 14rem)', overflow: 'auto' }}>
                <List>
                  {chatHistories.map((chat) => (
                    <ListItem
                      key={chat.id}
                      component="button"
                      onClick={() => loadChatHistory(chat.id)}
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        backgroundColor: activeChatId === chat.id ? 'action.selected' : 'inherit',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemText
                        primary={chat.title}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {chat.preview}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(chat.timestamp)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        )}

        <Card
          sx={{
            width: showHistory ? '75%' : '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Message color="primary" sx={{ color: theme.palette.primary.main }} />
              <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main }}>
                {activeChatId
                  ? chatHistories.find((c) => c.id === activeChatId)?.title || 'Conversation'
                  : 'New Conversation'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowHistory(!showHistory)}
                sx={{ color: theme.palette.primary.main }}
                startIcon={<History fontSize="small" sx={{ color: theme.palette.primary.main }} />}
              >
                {showHistory ? 'Hide History' : 'History'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={startNewChat}
                sx={{ color: theme.palette.primary.main }}
                startIcon={<Message fontSize="small" sx={{ color: theme.palette.primary.main }} />}
              >
                New Chat
              </Button>
            </Box>
          </Box>

          <Box
            ref={scrollAreaRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isSameSenderAsPrev = prevMessage ? prevMessage.isUser === message.isUser : false;

              return (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.isUser ? 'flex-end' : 'flex-start',
                    mt: isSameSenderAsPrev ? 0 : 1.5,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: '80%',
                      borderRadius: message.isUser
                        ? '16px 4px 16px 16px'
                        : '4px 16px 16px 16px',
                      backgroundColor: message.isUser
                        ? theme.palette.primary.light
                        : theme.palette.secondary.light,
                      color: message.isUser
                        ? theme.palette.primary.contrastText
                        : theme.palette.secondary.contrastText,
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {typeof message.ChatResponse === 'string'
                        ? message.ChatResponse
                        : typeof message.ChatResponse === 'object'
                        ? JSON.stringify(message.ChatResponse, null, 2)
                        : String(message.ChatResponse)}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      mt: 0.25,
                      opacity: 0.7,
                      display: 'block',
                    }}
                  >
                    {formatDate(message.timestamp)}
                  </Typography>
                </Box>
              );
            })}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1.5 }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    borderRadius: '4px 16px 16px 16px',
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.secondary.contrastText,
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CircularProgress size={20} color="inherit" />
                  <Typography variant="body1" sx={{ display: 'inline-block', ml: 1 }}>
                    {' '}
                    Loading response...{' '}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>

          {activeWorkspace && (
            <Box
              sx={{
                p: 1,
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              {activeWorkspace.type === 'resume' && (
                <>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleQuickAction('summarize')}
                    sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }}
                  >
                    Summarize Resume
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleQuickAction('match')}
                    sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }}
                  >
                    Find Job Matches
                  </Button>
                </>
              )}
              {activeWorkspace.type === 'jd' && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleQuickAction('match')}
                  sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }}
                >
                  Find Candidate Matches
                </Button>
              )}
            </Box>
          )}

          <Divider />
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <Box sx={{ width: '20%', alignSelf: 'stretch' }}>
              <WorkspaceSelector />
            </Box>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              multiline
              minRows={1}
              maxRows={4}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <CustomButton
              type="submit"
              variant="primary"
              disabled={isLoading || !input.trim()}
              sx={{
                height: 'auto',
                minWidth: '48px',
                p: 1.5,
                alignSelf: 'stretch',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            </CustomButton>
          </Box>
        </Card>
      </Box>
      <style>{`
        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
        `}</style>
    </>
  );
};

export default WorkspaceChat;
