import express from 'express';
import { protectRoute } from '../Middleware/auth.middleware.js';
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
  getMyProfile,
  updateProfile
} from '../controllers/user.controller.js';

const router = express.Router();

// Apply middleware to all routes
router.use(protectRoute);

// Routes
router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);

router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendReqs);

// PROFILE routes
router.get("/profile", protectRoute, getMyProfile);
router.put("/profile", protectRoute, updateProfile);

export default router;
