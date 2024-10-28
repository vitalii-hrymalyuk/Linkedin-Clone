import express, { Router } from 'express'
import { getCurrentUser, login, logout, signup } from '../controllers/auth.controller';
import { protectRoute } from '../middleware/auth.middleware';

const router = express.Router();

export const authRoutes = (): Router => {

	router.post('/signup', signup);
	router.post('/login', login);
	router.post('/logout', logout);

	router.get('/me', protectRoute, getCurrentUser);

	return router;
}



