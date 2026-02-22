import { useFriendStore } from '@/stores/useFriendStore';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { UserPlus, Users } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { Friend } from '@/types/user';
import InviteSuggestionList from '../newGroupChat/InviteSuggestionList';
import SelectedUsersList from '../newGroupChat/SelectedUsersList';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/useChatStore';

const NewGroupChatModal = () => {
    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');
    const { friends, getFriends } = useFriendStore();
    const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
    const { loading, createConversation } = useChatStore();

    const handleGetFriends = async () => {
        await getFriends();
    };

    const handleSelectFriend = (friend: Friend) => {
        setInvitedUsers([...invitedUsers, friend]);
        setSearch('');
    };

    const handleRemoveFriend = (friends: Friend) => {
        setInvitedUsers(invitedUsers.filter((u) => u._id !== friends._id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (invitedUsers.length === 0) {
                toast.warning('You have to invite at least one friend!');
                return;
            }

            await createConversation(
                'group',
                groupName,
                invitedUsers.map((u) => u._id),
            );
            setSearch('');
            setInvitedUsers([]);
        } catch (error) {
            console.error('Error when handle submit in NewChatModal');
        }
    };

    const filteredFriends = friends.filter(
        (friend) =>
            friend.displayName.toLowerCase().includes(search.toLowerCase()) &&
            !invitedUsers.some((u) => u._id === friend._id),
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={handleGetFriends}
                    className="flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent transition cursor-pointer"
                >
                    <Users className="size-4" />
                    <span className="sr-only">Create group chat</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 border-none">
                <DialogHeader>
                    <DialogTitle className="capitalize">
                        Create group chat
                    </DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* groupname */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="groupName"
                            className="text-sm font-semibold"
                        >
                            Group name
                        </Label>
                        <Input
                            id="groupName"
                            placeholder="Type group name here..."
                            className="glass border-border/50 focus:border-primary/50 transition-smooth"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Add group members */}

                    <div className="space-y-2">
                        <Label
                            htmlFor="invite"
                            className="text-sm font-semibold"
                        >
                            Invite Friends
                        </Label>
                        <Input
                            id="invite"
                            placeholder="Find by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Suggested List */}
                        {search && filteredFriends.length > 0 && (
                            <InviteSuggestionList
                                filteredFriends={filteredFriends}
                                onSelect={handleSelectFriend}
                            />
                        )}

                        {/* Invited Users */}
                        <SelectedUsersList
                            invitedUsers={invitedUsers}
                            onRemove={handleRemoveFriend}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
                        >
                            {loading ? (
                                <span>Creating...</span>
                            ) : (
                                <>
                                    <UserPlus className="size-4 mr-2" />
                                    Create group chat
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewGroupChatModal;
