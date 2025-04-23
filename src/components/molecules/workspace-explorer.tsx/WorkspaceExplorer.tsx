import CustomButton from '@/components/atoms/button/CustomButton';
import { useWorkspace } from '@/context/WorkspaceContext';
import { ChatApi } from '@/lib/api/chatApi';
import { Close, History, Message, Send } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    //Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
//import WorkspaceSelector from '../Workspace-Selector/WorkspaceSelector';

interface MessageType {
    id: string;
    ChatResponse: unknown;
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

interface ChatApiResponse {
    response?: string; // The actual chat response, optional in case of errors
    // You might have other properties in your API response, add them here
    [key: string]: unknown; // To allow for other potential properties
    
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
        let initialMessage = `Hello! I'm your assistant. How can I help you with your `;
        if (activeWorkspace?.name) {
            initialMessage += `"${activeWorkspace.name}" `;
        }
        if (activeWorkspace?.type === 'medical') {
            initialMessage += 'medical document today?';
        } else if (activeWorkspace?.type === 'patient') {
            initialMessage += 'patient document today?';
        } else {
            initialMessage += 'documents today?';
        }

        setMessages([
            {
                id: createId(),
                ChatResponse: initialMessage,
                isUser: false,
                timestamp: new Date(),
            },
        ]);
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

    const sendChatMessage = useCallback(async (message: string) => {
        setIsLoading(true);
        try {
            const result: ChatApiResponse = (await ChatApi.sendMessage(message)).data;
            console.log("Chat Response : ", result);
            return result.response || '';
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

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
            const aiReply = await sendChatMessage(userMessage.ChatResponse as string);
            console.log("Ai Chat Reply (workspace Chat): ", aiReply);
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
                    title: (userMessage.ChatResponse as string).slice(0, 30) + ((userMessage.ChatResponse as string).length > 30 ? '...' : ''),
                    preview: (userMessage.ChatResponse as string).slice(0, 50) + ((userMessage.ChatResponse as string).length > 50 ? '...' : ''),
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
        let initialMessage = `Hello! I'm your assistant. How can I help you with your `;
        if (activeWorkspace?.name) {
            initialMessage += `"${activeWorkspace.name}" `;
        }
        if (activeWorkspace?.type === 'medical') {
            initialMessage += 'medical document today?';
        } else if (activeWorkspace?.type === 'patient') {
            initialMessage += 'patient document today?';
        } else {
            initialMessage += 'documents today?';
        }
        setMessages([
            {
                id: createId(),
                ChatResponse: initialMessage,
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
            case 'summarize-medical':
                if (activeWorkspace?.type === 'medical' && activeWorkspace?.filePath) {
                    if (typeof activeWorkspace.filePath === 'string') {
                        handleSummaryRequest(activeWorkspace.filePath, 'medical');
                    } else {
                        enqueueSnackbar('The medical document file path is not valid or missing.', { variant: 'error' });
                    }
                } else {
                    enqueueSnackbar('Please select a medical document first', { variant: 'error' });
                }
                break;
            case 'info-medical':
                if (activeWorkspace?.type === 'medical') {
                    setInput('Get key information from this medical document');
                } else {
                    enqueueSnackbar('Please select a medical document first', { variant: 'error' });
                }
                break;
            case 'summarize-patient':
                if (activeWorkspace?.type === 'patient' && activeWorkspace?.filePath) {
                    if (typeof activeWorkspace.filePath === 'string') {
                        handleSummaryRequest(activeWorkspace.filePath, 'patient');
                    } else {
                        enqueueSnackbar('The patient document file path is not valid or missing.', { variant: 'error' });
                    }
                } else {
                    enqueueSnackbar('Please select a patient document first', { variant: 'error' });
                }
                break;
            case 'info-patient':
                if (activeWorkspace?.type === 'patient') {
                    setInput('Get key information from this patient document');
                } else {
                    enqueueSnackbar('Please select a patient document first', { variant: 'error' });
                }
                break;
            default:
                break;
        }
    };

    const handleSummaryRequest = async (filePath: string, docType: 'medical' | 'patient') => {
        const userMessage: MessageType = {
            id: createId(),
            ChatResponse: `Generate a summary of this ${docType} document`,
            isUser: true,
            timestamp: new Date(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            const aiReply = await sendChatMessage(`Generate a summary of the ${docType} document at: ${filePath}`);

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
                    title: `${docType.charAt(0).toUpperCase() + docType.slice(1)} Summary`,
                    preview: `Generated summary of ${docType} document`,
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
            enqueueSnackbar(`Failed to generate ${docType} document summary`, { variant: 'error' });
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
                            <Message color="primary" sx={{ color: 'white' }} />
                            <Typography variant="subtitle1" sx={{ color: 'white' }}>
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
                                sx={{ color: 'white' }}
                                startIcon={<History fontSize="small" sx={{ color: 'white' }} />}
                            >
                                {showHistory ? 'Hide History' : 'History'}
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={startNewChat}
                                sx={{ color: 'white', '&:hover': {} }}
                                startIcon={<Message fontSize="small" sx={{ color: 'white' }} />}
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
                                                ? '#000' // Make user message text black
                                                : theme.palette.secondary.contrastText,
                                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {typeof message.ChatResponse === 'string'
                                                ? message.ChatResponse
                                                : typeof message.ChatResponse === 'object'
                                                ? JSON.stringify(message.ChatResponse, null, 2)
                                                : null}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ mt: 0.5, display: 'block' }}
                                        >
                                            {formatDate(message.timestamp)}
                                        </Typography>
                                    </Paper>
                                </Box>
                            );
                        })}
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        {activeWorkspace?.type === 'medical' && (
                            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                <CustomButton onClick={() => handleQuickAction('summarize-medical')}>
                                    Summarize Medical Doc
                                </CustomButton>
                                <CustomButton onClick={() => handleQuickAction('info-medical')}>
                                    Get Medical Info
                                </CustomButton>
                            </Box>
                        )}
                        {activeWorkspace?.type === 'patient' && (
                            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                                <CustomButton onClick={() => handleQuickAction('summarize-patient')}>
                                    Summarize Patient Doc
                                </CustomButton>
                                <CustomButton onClick={() => handleQuickAction('info-patient')}>
                                    Get Patient Info
                                </CustomButton>
                            </Box>
                        )}
                        <form onSubmit={handleSendMessage}>
                            <TextField
                                fullWidth
                                label="Send a message"
                                variant="outlined"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton type="submit" disabled={isLoading}>
                                            <Send color="primary" />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </form>
                    </Box>
                </Card>
            </Box>
        </>
    );
};

export default WorkspaceChat;