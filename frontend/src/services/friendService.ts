import api from '@/lib/axios';
import { get } from 'react-hook-form';

export const friendService = {
    async searchByUsername(username: string) {
        const res = await api.get(`/users/search?username=${username}`);
        return res.data.user;
    },

    async sendFriendRequest(to: string, message?: string) {
        const res = await api.post('/friends/requests', { to, message });
        return res.data.message;
    },

    async getAllFriendRequests() {
        try {
            const res = await api.get('/friends/requests');
            const { sent, received } = res.data;
            return { sent, received };
        } catch (error) {
            console.error('Error when fetching all friend requests:', error);
        }
    },

    async acceptRequest(requestId: string) {
        try {
            const res = await api.post(`/friends/requests/${requestId}/accept`);
            return res.data.requestAcceptBy;
        } catch (error) {
            console.error('Error when accepting friend request:', error);
        }
    },

    async declineRequest(requestId: string) {
        try {
            const res = await api.post(
                `/friends/requests/${requestId}/decline`,
            );
        } catch (error) {
            console.error('Error when declining friend request:', error);
        }
    },

    async getFriendList() {
        const res = await api.get('/friends');
        return res.data.friends;
    },
};
