import express from 'express';

import {
    sendFriendRequest,
    acceptFriend,
    declineFriendRequest,
    getAllFriends,
    getFriendRequests,
} from '../controllers/friendController.js';

const router = express.Router();

router.post('/requests', sendFriendRequest);

router.post('/requests/:requestId/accept', acceptFriend);

router.post('/requests/:requestId/decline', declineFriendRequest);

router.get('/', getAllFriends);

router.get('/requests', getFriendRequests);

export default router;
