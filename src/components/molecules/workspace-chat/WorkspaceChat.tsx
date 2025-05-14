// import CustomButton from '@/components/atoms/button/CustomButton';
// import ChatMessages from '@/components/organisms/Chat-Messages/ChatMessages';
// import { useWorkspace } from '@/context/WorkspaceContext';
// import { MetProAiAPI } from '@/lib/api/flask-api';
// import { useToast } from '@/lib/hooks/useToast';
// import { Close, Send } from '@mui/icons-material';
// import {
//     Box,
//     Card,
//     CardContent,
//     Divider,
//     IconButton,
//     List,
//     ListItem,
//     ListItemText,
//     TextField,
//     Typography
// } from '@mui/material';
// import React, { useEffect, useRef, useState } from 'react';
// import WorkspaceSelector from '../Workspace-Selector/WorkspaceSelector';

// interface MessageType {
//     id: string;
//     ChatResponse: string;
//     isUser: boolean;
//     timestamp: Date;
//     isTyping?: boolean
// }

// // export interface Message {
// //   id: string
// //   role: "user" | "assistant" | "system"
// //   content: string
// //   timestamp: Date
// //   isTyping?: boolean
// // }

// interface ChatHistory {
//     id: string;
//     title: string;
//     preview: string;
//     timestamp: Date;
//     messages: MessageType[];
// }

// // Helper function to create a unique ID
// const createId = () => Date.now().toString();

// interface WorkspaceChatProps {
//     aiResponse?: string | null; // Accept AI response as a prop
// }

// const WorkspaceChat: React.FC<WorkspaceChatProps> = ({ aiResponse }) => {
//     const { toast } = useToast();
//     const { activeWorkspace } = useWorkspace();
//     const [showHistory, setShowHistory] = useState(false);
//     const [activeChatId, setActiveChatId] = useState<string | null>(null);
//     const scrollAreaRef = useRef<HTMLDivElement>(null);
//     const [isTyping, setIsTyping] = useState(false)

//     const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
//         {
//             id: '1',
//             title: 'CV Formatting Help',
//             preview: 'How do I format my CV for tech jobs?',
//             timestamp: new Date(Date.now() - 86400000), // 1 day ago
//             messages: [
//                 {
//                     id: '1-1',
//                     ChatResponse: 'Hello! I\'m your assistant. How can I help you today?',
//                     isUser: false,
//                     timestamp: new Date(Date.now() - 86400000),
//                 },
//                 {
//                     id: '1-2',
//                     ChatResponse: 'How do I format my CV for tech jobs?',
//                     isUser: true,
//                     timestamp: new Date(Date.now() - 86300000),
//                 },
//                 {
//                     id: '1-3',
//                     ChatResponse: 'For tech jobs, focus on your technical skills, relevant projects, and experience with specific technologies. Use a clean, scannable format with bullet points. Include a GitHub link and any relevant certifications.',
//                     isUser: false,
//                     timestamp: new Date(Date.now() - 86200000),
//                 },
//             ],
//         },
//         {
//             id: '2',
//             title: 'Resume Keywords',
//             preview: 'What keywords should I include in my resume?',
//             timestamp: new Date(Date.now() - 172800000), // 2 days ago
//             messages: [
//                 {
//                     id: '2-1',
//                     ChatResponse: 'Hello! I\'m your assistant. How can I help you today?',
//                     isUser: false,
//                     timestamp: new Date(Date.now() - 172800000),
//                 },
//                 {
//                     id: '2-2',
//                     ChatResponse: 'What keywords should I include in my resume?',
//                     isUser: true,
//                     timestamp: new Date(Date.now() - 172700000),
//                 },
//                 {
//                     id: '2-3',
//                     ChatResponse: 'Include industry-specific keywords from the job description, technical skills, certifications, and action verbs like "developed", "implemented", or "managed". This helps with ATS systems that scan resumes.',
//                     isUser: false,
//                     timestamp: new Date(Date.now() - 172600000),
//                 },
//             ],
//         },
//     ]);

//     const [messages, setMessages] = useState<MessageType[]>([
//         {
//             id: '1',
//             ChatResponse: `Hello! I'm your assistant for the "${activeWorkspace?.name || 'Current'}" workspace. How can I help you today?`,
//             isUser: false,
//             timestamp: new Date(),
//         },
//     ]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         if (aiResponse) {
//             // Add AI response to messages
//             const aiMessage: MessageType = {
//                 id: createId(),
//                 ChatResponse: aiResponse,
//                 isUser: false,
//                 timestamp: new Date(),
//             };
//             setMessages((prevMessages) => [...prevMessages, aiMessage]);
//             if (scrollAreaRef.current) {
//                 scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
//             }
//         }

//     }, [aiResponse]);

//     const handleSendMessage = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!input.trim()) return;

//         // Create user message object
//         const userMessage: MessageType = {
//             id: createId(),
//             ChatResponse: input,
//             isUser: true,
//             timestamp: new Date(),
//         };

//         // Update messages with user input
//         const updatedMessages = [...messages, userMessage];
//         setMessages(updatedMessages);
//         setInput('');
//         setIsLoading(true);
//         setIsTyping(true)
//         try {
//             // Make API call to send chat message
//             // We're assuming the workspace context might inform if we're looking at job descriptions
//             const medicalSearch = activeWorkspace?.type === 'medical_documents' || false;
//             const response = await MetProAiAPI.sendChatMessage(userMessage.ChatResponse, medicalSearch, activeWorkspace?.name || '');
//             console.log("Response from API:", response);

//             // Create AI response object
//             const aiResponse: MessageType = {
//                 id: createId(),
//                 ChatResponse: JSON.stringify(response),
//                 isUser: false,
//                 timestamp: new Date(),
//             };

//             // Update messages with AI response
//             const newMessages = [...updatedMessages, aiResponse];
//             setMessages(newMessages);

//             // Handle chat history management
//             if (!activeChatId) {
//                 // Create new chat if there's no active chat
//                 const newChatId = createId();
//                 const newChat: ChatHistory = {
//                     id: newChatId,
//                     title: userMessage.ChatResponse.slice(0, 30) + (userMessage.ChatResponse.length > 30 ? '...' : ''),
//                     preview: userMessage.ChatResponse.slice(0, 50) + (userMessage.ChatResponse.length > 50 ? '...' : ''),
//                     timestamp: new Date(),
//                     messages: newMessages,
//                 };

//                 setChatHistories(prev => [newChat, ...prev]);
//                 setActiveChatId(newChatId);
//                 toast({
//                     title: "Chat saved",
//                     description: "Your conversation has been saved to history",
//                 });
//             } else {
//                 // Update existing chat
//                 setChatHistories(prev =>
//                     prev.map(chat =>
//                         chat.id === activeChatId
//                             ? { ...chat, messages: newMessages, timestamp: new Date() }
//                             : chat
//                     )
//                 );
//             }

//         } catch (error) {
//             // Handle errors
//             console.error('Error sending message:', error);

//             // Create error message
//             const errorMessage: MessageType = {
//                 id: createId(),
//                 ChatResponse: "Sorry, I encountered an error processing your request. Please try again.",
//                 isUser: false,
//                 timestamp: new Date(),
//             };

//             setMessages([...updatedMessages, errorMessage]);

//             // Show toast notification with error
//             toast({
//                 title: "Error",
//                 description: "Failed to get response from assistant",
//                 variant: "destructive",
//             });
//         } finally {
//             setIsLoading(false);
//             setIsTyping(false)

//         }
//     };


//     const loadChatHistory = (chatId: string) => {
//         const chat = chatHistories.find(c => c.id === chatId);
//         if (chat) {
//             setMessages(chat.messages);
//             setActiveChatId(chatId);
//         }
//     };


//         return (
//             <Box sx={{
//                 display: 'flex',
//                 gap: 2,
//                 height: '100%',
//                 border: 1,
//                 borderRadius: 2,
//                 borderColor: 'divider',

//             }}>
//                 {/* Chat History Sidebar */}
//                 {showHistory && (
//                     <Card sx={{ width: '25%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
//                         <CardContent sx={{ p: 2, flex: 1, overflow: 'hidden' }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//                                 <Typography variant="subtitle1">Recent Conversations</Typography>
//                                 <IconButton onClick={() => setShowHistory(false)} size="small">
//                                     <Close fontSize="small" />
//                                 </IconButton>
//                             </Box>
//                             <Box sx={{ height: 'calc(100vh - 14rem)', overflow: 'auto' }}>
//                                 <List>
//                                     {chatHistories.map((chat) => (
//                                         <ListItem
//                                             key={chat.id}
//                                             component="button"
//                                             onClick={() => loadChatHistory(chat.id)}
//                                             sx={{
//                                                 mb: 1,
//                                                 borderRadius: 1,
//                                                 backgroundColor: activeChatId === chat.id ? 'action.selected' : 'inherit',
//                                                 '&:hover': {
//                                                     backgroundColor: 'action.hover'
//                                                 }
//                                             }}
//                                         >
//                                             <ListItemText
//                                                 primary={chat.title}
//                                                 secondary={
//                                                     <>
//                                                         <Typography variant="body2" color="text.secondary" noWrap>
//                                                             {chat.preview}
//                                                         </Typography>
//                                                         <Typography variant="caption" color="text.secondary">
//                                                             {chat.timestamp.toLocaleDateString([], {
//                                                                 month: 'short',
//                                                                 day: 'numeric',
//                                                                 hour: '2-digit',
//                                                                 minute: '2-digit'
//                                                             })}
//                                                         </Typography>
//                                                     </>
//                                                 }
//                                             />
//                                         </ListItem>
//                                     ))}
//                                 </List>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 )}

//                 {/* Main Chat Area */}
//                 <Card sx={{
//                     width: showHistory ? '75%' : '100%',
//                     overflow: 'hidden',
//                     display: 'flex',
//                     flexDirection: 'column'
//                 }}>
//                     <Box sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         p: 2,
//                         borderBottom: 1,
//                         borderColor: 'divider'
//                     }}>
//                         {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Message color="primary" sx={{color:"white"}}/>
//             <Typography variant="subtitle1">
//               {activeChatId
//                 ? chatHistories.find(c => c.id === activeChatId)?.title || 'Chat'
//                 : 'New Conversation'}
//             </Typography>
//           </Box> */}

//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             {/* <Button 
//               variant="text"
//               size="small"
//               onClick={() => setShowHistory(!showHistory)}
//               sx={{color:"white"}}
//               startIcon={<History fontSize="small" sx={{color:"white"}}/>}
//             >
//               {showHistory ? 'Hide History' : 'History'}
//             </Button> */}
//                             {/* <Button 
//               variant="outlined"
//               size="small"
//               onClick={startNewChat}
//               sx={{color:"white"}}
//               startIcon={<Message fontSize="small" sx={{color:"white"}} />}
//             >
//               New Chat
//             </Button> */}
//                         </Box>
//                     </Box>

//                     <Box
//                         ref={scrollAreaRef}
//                         sx={{
//                             flex: 1,
//                             overflowY: 'auto',
//                             p: 3,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             gap: 2,
//                         }}
//                     >
//                         <ChatMessages messages={messages} isTyping={isTyping} conversationTitle="New Conversation" />
//                         {/* {messages.map((message) => (
//             <Box 
//               key={message.id} 
//               sx={{ 
//                 display: 'flex', 
//                 justifyContent: message.isUser ? 'flex-end' : 'flex-start',

//               }}
//             >
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 2,
//                   maxWidth: '80%',
//                   borderRadius: 2,
//                   backgroundColor: message.isUser 
//                     ? 'DodgerBlue.main' 
//                     : 'BlueMirage.main',
//                   color: message.isUser 
//                     ? 'black' 
//                     : 'white'
//                 }}
//               >
//                 <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
//                   {message.ChatResponse}
//                 </Typography>
//                 <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5, display: 'block' }}>
//                   {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </Typography>
//               </Paper>
//             </Box>
//           ))} */}
//                         {/* {isLoading && (
//             <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 2,
//                   maxWidth: '80%',
//                   borderRadius: 2,
//                   backgroundColor: 'BlueMirage.main',
//                   color: 'white'
//                 }}
//               >
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CircularProgress size={16} color="inherit" />
//                   <Typography>Processing...</Typography>
//                 </Box>
//               </Paper>
//             </Box>
//           )} */}
//                     </Box>
//                     <Divider />

//                     <Box
//                         component="form"
//                         onSubmit={handleSendMessage}
//                         sx={{ p: 2, display: 'flex', gap: 2 }}>
//                         <Box sx={{ width: '20%' }}>
//                             <WorkspaceSelector />
//                         </Box>

//                         <TextField
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Type your message here..."
//                             multiline
//                             minRows={2}
//                             maxRows={4}
//                             fullWidth
//                             variant="outlined"
//                             onKeyDown={(e) => {
//                                 if (e.key === 'Enter' && !e.shiftKey) {
//                                     e.preventDefault();
//                                     handleSendMessage(e);
//                                 }
//                             }}
//                         />
//                         <CustomButton
//                             type="submit"
//                             variant="primary"
//                             disabled={isLoading || !input.trim()}
//                             sx={{ height: 'auto', minWidth: '56px' }}
//                         >
//                             <Send />
//                         </CustomButton>
//                     </Box>
//                 </Card>
//             </Box>
//         );
//     };

// export default WorkspaceChat;

import CustomButton from '@/components/atoms/button/CustomButton';
import { useWorkspace } from '@/context/WorkspaceContext';
//import { ChatApi } from '@/lib/api/chatApi';
import { Close, History, Message, Send } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
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
import React, { useEffect, useRef, useState } from 'react';
import WorkspaceSelector from '../Workspace-Selector/WorkspaceSelector';
import { MetProAiAPI } from '@/lib/api/flask-api';

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

const createId = () => Date.now().toString();

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

    // In WorkspaceChat.tsx
    const sendChatMessage = async (message: string) => {
        setIsLoading(true);
        try {
            const result = await MetProAiAPI.sendChatMessage(message); // Let TypeScript infer the type
            console.log("Chat Response:", result);
            return result; // result is now string
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

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
            const aiReply = await MetProAiAPI.sendChatMessage(userMessage.ChatResponse as string);
            console.log("Ai Chat Reply (workspace Chat): ", aiReply)
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
                if ((activeWorkspace?.type as string) === 'medical' && activeWorkspace?.filePath) {
                    if (typeof activeWorkspace.filePath === 'string') {
                        handleSummaryRequest(activeWorkspace.filePath, 'medical');
                    } else {
                        enqueueSnackbar('The file path is not valid or missing.', { variant: 'error' });
                    }
                } else if ((activeWorkspace?.type as string) === 'patient' && activeWorkspace?.filePath) {
                    if (typeof activeWorkspace.filePath === 'string') {
                        handleSummaryRequest(activeWorkspace.filePath, 'patient');
                    } else {
                        enqueueSnackbar('The file path is not valid or missing.', { variant: 'error' });
                    }
                }
                else {
                    enqueueSnackbar('Please select a document first', { variant: 'error' });
                }
                break;
            case 'info':
                if ((activeWorkspace?.type as string) === 'medical') {
                    setInput('Get key information from this medical document');
                } else if ((activeWorkspace?.type as string) === 'patient') {
                    setInput('Get key information from this patient document');
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
                                sx={{
                                    color: 'white', '&:hover': {

                                    }
                                }}
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
                            {(activeWorkspace.type as string) === 'medical' && (
                                <>
                                    <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => handleQuickAction('summarize')}
                                        sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }}
                                    >
                                        Summarize Medical Doc
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => handleQuickAction('info')}
                                        sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }}
                                    >
                                        Get Medical Info
                                    </Button>
                                </>
                            )}
                            {(activeWorkspace.type as string) === 'patient' && (
                                <><Button
                                    size="small"
                                    variant="text"
                                    onClick={() => handleQuickAction('summarize')}
                                    sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }}
                                >
                                    Summarize Patient Doc
                                </Button>
                                    <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => handleQuickAction('info')}
                                        sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }}
                                    >
                                        Get Patient Info
                                    </Button>
                                </>
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