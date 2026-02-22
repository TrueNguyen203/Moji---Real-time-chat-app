import { useFriendStore } from '@/stores/useFriendStore';
import FriendRequestItem from './FriendRequestItem';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const ReceivedRequests = () => {
    const { acceptFriendRequest, declineFriendRequest, loading, receivedList } =
        useFriendStore();

    if (!receivedList || receivedList.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                You have not received any friend requests.
            </p>
        );
    }

    const handleAccept = async (requestId: string) => {
        try {
            await acceptFriendRequest(requestId);
            toast.success('Friend request accepted!');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDecline = async (requestId: string) => {
        try {
            await declineFriendRequest(requestId);
            toast.info('Friend request declined.');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="space-y-3 mt-4">
            {receivedList.map((req) => (
                <FriendRequestItem
                    key={req._id}
                    requestInfo={req}
                    type="received"
                    actions={
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleAccept(req._id)}
                                disabled={loading}
                            >
                                Accept
                            </Button>
                            <Button
                                size="sm"
                                variant="destructiveOutline"
                                onClick={() => handleDecline(req._id)}
                                disabled={loading}
                            >
                                Decline
                            </Button>
                        </div>
                    }
                />
            ))}
        </div>
    );
};

export default ReceivedRequests;
