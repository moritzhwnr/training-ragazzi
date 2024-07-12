'use client';

import { useChat } from '@ai-sdk/react';
import { IconButton, InputAdornment, TextField, Box, Typography, CircularProgress, Avatar } from '@mui/material';
import { ArrowCircleUp, AutoAwesome, AccountCircle, Person } from '@mui/icons-material';
import { Colors } from '../theme/colors';
import { Activity } from '../helpers/types';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

// Interface for ChatProps which expects an array of activities
interface ChatProps {
    activities: { data: Activity[] }
}

// Default export function for the Chat component
export default function Chat({ activities }: ChatProps) {
    // Destructuring the return values from the useChat hook
    const {
        messages, // Array of messages
        input, // Current input value
        handleInputChange, // Function to handle input changes
        handleSubmit, // Function to handle form submission
        isLoading, // Boolean indicating if a request is in progress
        append // Function to append a message to the chat
    } = useChat({
        body: {
            activities: activities // Passing activities as part of the request body
        },
    });

    const [initialMessageSent, setInitialMessageSent] = useState(false); // State to track if the initial message has been sent

    // useEffect hook to send an initial message when the component mounts
    useEffect(() => {
        if (!initialMessageSent) {
            append({ role: 'user', content: 'Analyze my week' }); // Customize the initial message as needed
            setInitialMessageSent(true);
        }
    }, [initialMessageSent, append]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '80vh',
            justifyContent: 'flex-end',
            gap: '20px'
            //backgroundColor: 'green'
        }}>
            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    overflowY: 'scroll',
                    scrollbarColor: 'red'
                }}>
                {messages.map(m => (
                    <Box
                        key={m.id}
                        sx={{
                            display: 'flex',
                            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', // Align content to right or left
                            //backgroundColor: 'yellow'
                        }}>
                        {m.role === 'user' ?
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }}>
                                <Typography
                                    variant={'body1'}
                                    color={'white'}
                                    sx={{
                                        width: 'fit-content',
                                        borderRadius: '5px',
                                        padding: '15px', // Add padding for better readability
                                        backgroundColor: Colors.purple,
                                    }}
                                >
                                    {m.content}
                                </Typography>
                                <Avatar>
                                    <Person sx={{ color: Colors.white }} />
                                </Avatar>*/
                            </Box>
                            :
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }}>
                                <Avatar>
                                    <Image src="/icon.svg" alt="Logo" fill priority />
                                </Avatar>
                                <Typography
                                    variant={'body1'}
                                    color={'white'}
                                    sx={{
                                        width: 'fit-content',
                                        borderRadius: '5px',
                                        padding: '15px', // Add padding for better readability
                                        paddingLeft: '30px',
                                        backgroundColor: Colors.magenta,
                                    }}
                                >
                                    <ReactMarkdown>
                                        {m.content}
                                    </ReactMarkdown>
                                </Typography>
                            </Box>
                        }

                    </Box>
                ))}
            </Box>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Ask a question..."
                    multiline
                    sx={{ color: Colors.white }}
                    maxRows={4}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {isLoading ? <CircularProgress /> : <IconButton
                                    type='submit'
                                    edge="end"
                                >
                                    <ArrowCircleUp />
                                </IconButton>}
                            </InputAdornment>
                        ),
                    }}
                />

            </form>
        </Box>
    );
}