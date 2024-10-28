import express, { Router } from 'express'
import { getPublicProfile, getSuggestedConnections, updateProfile } from '../controllers/user.controller';
import { protectRoute } from '../middleware/auth.middleware';

const router = express.Router();

export const userRoutes = (): Router => {

	router.get("/suggestions", protectRoute, getSuggestedConnections);
	router.get("/:username", protectRoute, getPublicProfile);

	router.put("/profile", protectRoute, updateProfile);

	return router;
}



