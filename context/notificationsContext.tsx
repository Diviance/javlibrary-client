import React, { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useWebSocket } from './websocketContext';
import { IconExclamationMark, IconCheck, IconInfoSmall } from '@tabler/icons-react';

const NotificationsListener = () => {
    const { subscribe } = useWebSocket();  // Using the subscribe method from the updated context

    // Function to handle and display notifications based on message type
    function handleNotification(data) {
        console.log('Handling notification for type:', data.type);

        switch (data.type) {
            case 'notifSuccess':
                notifications.show({
                    title: data.title,
                    message: data.message,
                    color: 'green',
                    icon: <IconCheck />,
                });
                break;
            case 'notifError':
                notifications.show({
                    title: data.title,
                    message: data.message,
                    color: 'red',
                    icon: <IconExclamationMark />,
                });
                break;
            case 'notifInfo':
                notifications.show({
                    title: data.title,
                    message: data.message,
                    color: 'blue',
                    icon: <IconInfoSmall />,
                });
                break;
            case 'notifUpdate':
                notifications.show({
                    id: data.id,
                    title: data.title,
                    message: (
                        <div>
                            {data.message}
                            {data.messageCont && (
                                <>
                                    <br />
                                    {data.messageCont}
                                </>
                            )}
                        </div>
                    ),
                    color: data.color,
                });

                notifications.update({
                    id: data.id,
                    title: data.title,
                    message: (
                        <div>
                            {data.message}
                            {data.messageCont && (
                                <>
                                    <br />
                                    {data.messageCont}
                                </>
                            )}
                        </div>
                    ),
                    color: data.color,
                    loading: data.loading,
                    autoClose: data.close,
                });
                break;
            default:
                console.log('Unhandled message type:', data.type);
        }
    }

    useEffect(() => {
        const unsubscribe = subscribe(data => {
            const parsedData = JSON.parse(data); // Assuming the data needs to be parsed from JSON
            console.log('Received:', parsedData);
            handleNotification(parsedData);
        });

        // Cleanup function to unsubscribe when the component unmounts or the subscribe function changes
        return unsubscribe;
    }, [subscribe]);

    return null;
};

export default NotificationsListener;
