import React, { useState, useRef, useEffect } from 'react';
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
  Avatar,
  CircularProgress
} from '@mui/material';
import { useToast } from '@/lib/hooks/useToast';
import { useWorkspace } from '@/context/WorkspaceContext';
import HireSenseAPI from '@/lib/api/axios-config';
import WorkspaceSelector from '../Workspace-Selector/WorkspaceSelector';
import CustomButton from '@/components/atoms/button/CustomButton';

interface MessageType {
  id: string;
  ChatResponse: string;
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

// Helper function to create a unique ID
const createId = () => Date.now().toString();

interface WorkspaceChatProps {
  aiResponse?: string | null; // Accept AI response as a prop
}

const WorkspaceChat: React.FC<WorkspaceChatProps> = ({ aiResponse }) => {
  const { toast } = useToast();
  const { activeWorkspace } = useWorkspace();
  const theme = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with a welcome message based on the active workspace name
    if (activeWorkspace?.name) {
      setMessages([
        {
          id: createId(),
          ChatResponse: `Hello! I'm your CV assistant for the "${activeWorkspace.name}" workspace. How can I help you today?`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } else {
      // Fallback message if no active workspace name is available
      setMessages([
        {
          id: createId(),
          ChatResponse: `Hello! I'm your CV assistant. How can I help you today?`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (aiResponse) {
      // Add AI response to messages
      const aiMessage: MessageType = {
        id: createId(),
        ChatResponse: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }
  }, [aiResponse]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Create user message object
    const userMessage: MessageType = {
      id: createId(),
      ChatResponse: input,
      isUser: true,
      timestamp: new Date(),
    };

    // Update messages with user input
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Make API call to send chat message
      // We're assuming the workspace context might inform if we're looking at job descriptions
      const jdSearch = activeWorkspace?.type === 'jd' || false;
      const response = await HireSenseAPI.sendChatMessage(userMessage.ChatResponse, jdSearch);
      console.log("Response from API:", typeof (response));

      // Create AI response object
      const aiResponse: MessageType = {
        id: createId(),
        ChatResponse: response.summary || "No summary available",
        isUser: false,
        timestamp: new Date(),
      };

      // Update messages with AI response
      const newMessages = [...updatedMessages, aiResponse];
      setMessages(newMessages);

      // Handle chat history management
      if (!activeChatId) {
        // Create new chat if there's no active chat
        const newChatId = createId();
        const newChat: ChatHistory = {
          id: newChatId,
          title: userMessage.ChatResponse.slice(0, 30) + (userMessage.ChatResponse.length > 30 ? '...' : ''),
          preview: userMessage.ChatResponse.slice(0, 50) + (userMessage.ChatResponse.length > 50 ? '...' : ''),
          timestamp: new Date(),
          messages: newMessages,
        };

        setChatHistories(prev => [newChat, ...prev]);
        setActiveChatId(newChatId);
        toast({
          title: "Chat saved",
          description: "Your conversation has been saved to history",
        });
      } else {
        // Update existing chat
        setChatHistories(prev =>
          prev.map(chat =>
            chat.id === activeChatId
              ? { ...chat, messages: newMessages, timestamp: new Date() }
              : chat
          )
        );
      }
    } catch (error) {
      // Handle errors
      console.error('Error sending message:', error);

      // Create error message
      const errorMessage: MessageType = {
        id: createId(),
        ChatResponse: "Sorry, I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, errorMessage]);

      // Show toast notification with error
      toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle keyword-based chat
  const handleKeywordChat = async (keyword: string) => {
    if (!keyword.trim()) return;

    // Create user message
    const userMessage: MessageType = {
      id: createId(),
      ChatResponse: `Search for keyword: ${keyword}`,
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Make API call for keyword-based chat
      const response = await HireSenseAPI.sendKeywordChat(keyword);

      // Create AI response
      const aiResponse: MessageType = {
        id: createId(),
        ChatResponse: response.reply,
        isUser: false,
        timestamp: new Date(),
      };

      // Update messages with AI response
      setMessages([...updatedMessages, aiResponse]);

      // Handle showing matched candidates if available
      if (response.matched_candidates && response.matched_candidates.length > 0) {
        // You could format and display matched candidates here
        // For example, append them to the AI response
        // This is a simplified example
        const candidatesMessage: MessageType = {
          id: createId(),
          ChatResponse: `Matched candidates: ${response.matched_candidates.map(c => `${c.name} (Score: ${c.relevance_score})`).join(', ')}`,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, candidatesMessage]);
      }

    } catch (error) {
      console.error('Error in keyword chat:', error);

      // Create error message
      const errorMessage: MessageType = {
        id: createId(),
        ChatResponse: "Sorry, I encountered an error with the keyword search. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to process keyword search",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: createId(),
        ChatResponse: `Hello! I'm your CV assistant for the "${activeWorkspace?.name || 'Current'}" workspace. How can I help you today?`,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setActiveChatId(null);
  };

  const loadChatHistory = (chatId: string) => {
    const chat = chatHistories.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setActiveChatId(chatId);
    }
  };

  // Function to handle quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'summarize':
        if (activeWorkspace?.type === 'resume' && activeWorkspace?.filePath) {
          // Start a summary request
          if (typeof activeWorkspace.filePath === 'string') {
            if (typeof activeWorkspace.filePath === 'string') {
              handleSummaryRequest(activeWorkspace.filePath);
            } else {
              toast({
                title: "Invalid File Path",
                description: "The file path is not valid or missing.",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Invalid File Path",
              description: "The file path is not valid or missing.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Cannot summarize",
            description: "Please select a resume file first",
            variant: "destructive",
          });
        }
        break;
      case 'match':
        if (activeWorkspace?.type === 'resume') {
          setInput("Find job matches for this resume");
        } else if (activeWorkspace?.type === 'jd') {
          setInput("Find candidate matches for this job");
        }
        break;
      default:
        break;
    }
  };

  // Function to handle summary requests
  const handleSummaryRequest = async (filePath: string) => {
    // Create user message
    const userMessage: MessageType = {
      id: createId(),
      ChatResponse: "Generate a summary of this resume",
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Make API call to get CV summary
      const response = await HireSenseAPI.getCVSummary(filePath);

      // Create AI response with summary
      const summaryResponse: MessageType = {
        id: createId(),
        ChatResponse: response.summary || "No summary available",
        isUser: false,
        timestamp: new Date(),
      };

      // Create skills response if available
      let newMessages = [...updatedMessages, summaryResponse];

      if (response.skills && response.skills.length > 0) {
        const skillsResponse: MessageType = {
          id: createId(),
          ChatResponse: `Key skills: ${response.skills.join(', ')}`,
          isUser: false,
          timestamp: new Date(),
        };

        newMessages = [...newMessages, skillsResponse];
      }

      setMessages(newMessages);

      // Update chat history
      if (!activeChatId) {
        const newChatId = createId();
        const newChat: ChatHistory = {
          id: newChatId,
          title: "Resume Summary",
          preview: "Generated summary of resume",
          timestamp: new Date(),
          messages: newMessages,
        };

        setChatHistories(prev => [newChat, ...prev]);
        setActiveChatId(newChatId);

        toast({
          title: "Summary generated",
          description: "Resume summary has been created",
        });
      } else {
        setChatHistories(prev =>
          prev.map(chat =>
            chat.id === activeChatId
              ? { ...chat, messages: newMessages, timestamp: new Date() }
              : chat
          )
        );
      }
    } catch (error) {
      console.error('Error generating summary:', error);

      // Create error message
      const errorMessage: MessageType = {
        id: createId(),
        ChatResponse: "Sorry, I encountered an error generating the summary. Please make sure the file is accessible.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to generate resume summary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      gap: 2,
      height: '100%',
      border: 1,
      borderRadius: 2,
      borderColor: 'divider',

    }}>
      {/* Chat History Sidebar */}
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
                        backgroundColor: 'action.hover'
                      }
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
                            {chat.timestamp.toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
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

      {/* Main Chat Area */}
      <Card sx={{
        width: showHistory ? '75%' : '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Message color="primary" sx={{ color: "white" }} />
            <Typography variant="subtitle1">
              {activeChatId
                ? chatHistories.find(c => c.id === activeChatId)?.title || 'Chat'
                : 'New Conversation'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="text"
              size="small"
              onClick={() => setShowHistory(!showHistory)}
              sx={{ color: "white" }}
              startIcon={<History fontSize="small" sx={{ color: "white" }} />}
            >
              {showHistory ? 'Hide History' : 'History'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={startNewChat}
              sx={{ color: "white" }}
              startIcon={<Message fontSize="small" sx={{ color: "white" }} />}
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
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',

              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  borderRadius: 2,
                  backgroundColor: message.isUser
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
                  color: theme.palette.getContrastText(
                    message.isUser ? theme.palette.primary.main : theme.palette.secondary.main
                  ),
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.ChatResponse}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5, display: 'block' }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  borderRadius: 2,
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.getContrastText(theme.palette.secondary.main),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  <Typography>Processing...</Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Quick Actions */}
        {activeWorkspace && (
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', gap: 1, borderTop: 1, borderColor: 'divider' }}>
            {activeWorkspace.type === 'resume' && (
              <>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleQuickAction('summarize')}
                >
                  Summarize Resume
                </Button>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleQuickAction('match')}
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
          sx={{ p: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ width: '20%' }}>
            <WorkspaceSelector />
          </Box>

          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            multiline
            minRows={2}
            maxRows={4}
            fullWidth
            variant="outlined"
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
            sx={{ height: 'auto', minWidth: '56px' }}
          >
            <Send />
          </CustomButton>
        </Box>
      </Card>
    </Box>
  );
};

export default WorkspaceChat;