import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useStompClient = (roomId) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [memberUpdate, setMemberUpdate] = useState(null);
    const [leaderboardUpdate, setLeaderboardUpdate] = useState(false);
    const [roomEvent, setRoomEvent] = useState(null);

    useEffect(() => {
        if (!roomId) return;

        const socket = new SockJS('http://localhost:8080/ws-study');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                setConnected(true);

                // Subscribe to chat topic
                client.subscribe(`/topic/chat/${roomId}`, (message) => {
                    const data = JSON.parse(message.body);
                    setChatMessages((prev) => [...prev, data]);
                });

                // Subscribe to member updates
                client.subscribe(`/topic/room/${roomId}/members`, (message) => {
                    const data = JSON.parse(message.body);
                    setMemberUpdate(data);
                });

                // Subscribe to leaderboard updates
                client.subscribe(`/topic/room/${roomId}/leaderboard`, (message) => {
                    setLeaderboardUpdate(prev => !prev);
                });

                // Subscribe to general room events
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const data = JSON.parse(message.body);
                    setRoomEvent(data);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setConnected(false);
            },
            onError: (error) => {
                console.error('WebSocket error:', error);
            },
        });

        client.activate();
        setStompClient(client);

        // Cleanup on unmount
        return () => {
            if (client && client.active) {
                client.deactivate();
            }
        };
    }, [roomId]);

    const send = (destination, message) => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination,
                body: JSON.stringify(message),
            });
        }
    };

    return { stompClient, connected, chatMessages, setChatMessages, memberUpdate, leaderboardUpdate, roomEvent, send };
};
