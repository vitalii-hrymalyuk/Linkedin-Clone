import { Application } from 'express';
import { authRoutes } from './auth.route';
import { userRoutes } from './user.route';
import { postRoutes } from './post.route';

const BASE_PATH = '/api/v1';
export const appRoutes = (app: Application): void => {
	app.use(`${BASE_PATH}/auth`, authRoutes());
	app.use(`${BASE_PATH}/user`, userRoutes());
	app.use(`${BASE_PATH}/post`, postRoutes());
}