import Friend from '../models/Friend.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export const sendFriendRequest = async (req, res) => {
    try {
        const { to, message } = req.body;

        const from = req.user._id;

        // If user send friend request to themselves
        if (from.toString() === to) {
            return res
                .status(400)
                .json({ message: 'Can not send friend request to yourself' });
        }

        const userExists = await User.exists({ _id: to });

        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        let userA = from.toString();
        let userB = to.toString();

        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }

        // Checking the relationship between userA and userB
        const [alreadyFriends, existingRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from },
                ],
            }),
        ]);

        if (alreadyFriends) {
            return res.status(400).json({ message: 'Already friends' });
        }

        if (existingRequest) {
            return res
                .status(400)
                .json({ message: 'Friend request already sent' });
        }

        const request = await FriendRequest.create({
            from,
            to,
            message,
        });

        return res
            .status(201)
            .json({ message: 'Friend request sent successfully', request });
    } catch (error) {
        console.error('Error calling sendFriendRequest', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const acceptFriend = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res
                .status(404)
                .json({ message: 'Friend request not found' });
        }

        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to accept this request',
            });
        }

        const friend = await Friend.create({
            userA: request.from,
            userB: request.to,
        });

        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(request.from)
            .select('_id displayName avatarUrl')
            .lean();

        return res.status(200).json({
            message: 'Successfully accept',
            newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                avatarUrl: from?.avatarUrl,
            },
        });
    } catch (error) {
        console.error('Error calling acceptFriend', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res
                .status(404)
                .json({ message: 'Friend request not found' });
        }

        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to decline this request',
            });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.sendStatus(204);
    } catch (error) {
        console.error('Error calling declineFriendRequest', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendships = await Friend.find({
            $or: [{ userA: userId }, { userB: userId }],
        })
            .populate('userA', '_id displayName avatarUrl username')
            .populate('userB', '_id displayName avatarUrl username')
            .lean();

        if (!friendships.length) {
            return res.status(200).json({ friends: [] });
        }

        const friends = friendships.map((f) =>
            f.userA._id.toString() === userId.toString() ? f.userB : f.userA,
        );

        return res.status(200).json({ friends });
    } catch (error) {
        console.error('Error calling getAllFriends', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const popluateFields = '_id username displayName avatarUrl';

        const [sent, received] = await Promise.all([
            FriendRequest.find({ from: userId })
                .populate('to', popluateFields)
                .lean(),
            FriendRequest.find({ to: userId })
                .populate('from', popluateFields)
                .lean(),
        ]);

        return res.status(200).json({ sent, received });
    } catch (error) {
        console.error('Error calling getFriendRequests', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
