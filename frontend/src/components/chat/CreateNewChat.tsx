import { useFriendStore } from '@/stores/useFriendStore';
import { Card } from '../ui/card';
import { DialogTrigger, Dialog } from '../ui/dialog';
import { MessageCircle } from 'lucide-react';
import FriendListModal from '../createNewChat/FriendListModal';

const CreateNewChat = () => {
    const { getFriends } = useFriendStore();

    const handleGetFriends = async () => {
        getFriends();
    };
    return (
        <div className="flex gap-2">
            <Card
                className="flex-1 p-2 glass cursor-pointer hover:shadow-soft transition-smooth group/card"
                onClick={handleGetFriends}
            >
                <Dialog>
                    <DialogTrigger>
                        <div className="flex items-center gap-4">
                            <div className="size-8 bg-gradient-chat rounded-full flex items-center justify-center group-hover/card:scale-110 transition-bounce">
                                <MessageCircle className="size-4 text-white" />
                            </div>
                            <span className="text-sm font-medium capitalize">
                                Send new message
                            </span>
                        </div>
                    </DialogTrigger>

                    <FriendListModal />
                </Dialog>
            </Card>
        </div>
    );
};

export default CreateNewChat;
