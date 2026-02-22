import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import type { SocketState } from '@/types/store';
import { useChatStore } from './useChatStore';

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    onlineUsers: [],

    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;

        if (existingSocket?.connected) return; // Avoid creating many sockets

        const socket: Socket = io(baseURL, {
            auth: { token: accessToken },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        set({ socket });

        socket.on('connect', () => {
            console.log('✅ Socket connected successfully:', socket.id);
        });
        // online users
        socket.on('online-users', (userIds) => {
            set({ onlineUsers: userIds });
        });

        // new message
        socket.on('new-message', ({ message, conversation, unreadCounts }) => {
            useChatStore.getState().addMessage(message);
            const lastMessage = {
                _id: conversation.lastMessage._id,
                content: conversation.lastMessage.content,
                createdAt: conversation.lastMessage.createdAt,
                sender: {
                    _id: conversation.lastMessage.senderId,
                    displayName: '',
                    avatarUrl: null,
                },
            };

            const updatedConversation = {
                ...conversation,
                lastMessage,
                unreadCounts,
            };

            if (
                useChatStore.getState().activeConversationId ===
                message.conversationId
            ) {
                useChatStore.getState().markAsSeen();
            }

            useChatStore.getState().updateConversation(updatedConversation);
        });

        //readmessage
        socket.on('read-message', ({ conversation, lastMessage }) => {
            const updated = {
                _id: conversation._id,
                lastMessage,
                lastMessageAt: conversation.lastMessageAt,
                unreadCounts: conversation.unreadCounts,
                seenBy: conversation.seenBy,
            };
            useChatStore.getState().updateConversation(updated);
        });

        // new group chat
        socket.on('new-group', (conversation) => {
            useChatStore.getState().addConvo(conversation);
            socket.emit('join-conversation', conversation._id);
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
        });

        socket.on('error', (error) => {
            console.error('❌ Socket error:', error);
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));
