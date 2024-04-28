import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import EventEmitter from 'events';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

const emitter = new EventEmitter();

interface WebSocketContextType {
    sendMessage: (message: string) => void;
    subscribe: (callback: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    // Function to initialize WebSocket connection
    const connectWebSocket = () => {
        const ws = new WebSocket('ws://10.0.0.21:5100/ws');

        ws.onopen = () => {
            console.log('WebSocket connected');
            notifications.show({
                title: 'WebSocket Connected',
                message: 'The websocket was connected successfully',
                color: 'green',
                icon: <IconCheck />,
            });
            setSocket(ws); // Save the socket instance when connected
        };

        ws.onmessage = (event) => {
            console.log('Message Received:', event.data);
            emitter.emit('message', event.data);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = (event) => {
            console.log('WebSocket disconnected', event.reason);
            setSocket(null); // Clear the socket instance on disconnect
            if (!event.wasClean) {
                // If the disconnection was not clean, try to reconnect
                setTimeout(() => {
                    connectWebSocket(); // Attempt to reconnect in 1 second
                }, 1000);
            }
        };

        return ws; // Return the WebSocket instance
    };

    useEffect(() => {
        const ws = connectWebSocket(); // Connect on component mount

        return () => {
            ws.close(1000, 'Component unmounting'); // Ensure a clean disconnect on unmount
        };
    }, []);

    const sendMessage = useCallback((message: string) => {
        if (socket) {
            socket.send(message);
        }
    }, [socket]);

    const subscribe = useCallback((callback: (data: any) => void) => {
        emitter.on('message', callback);
        return () => emitter.off('message', callback);
    }, []);

    const value = useMemo(() => ({
        sendMessage,
        subscribe,
    }), [sendMessage, subscribe]);

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
