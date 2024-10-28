import { Application } from 'express';
import { authRoutes } from './auth.route';
import { userRoutes } from './user.route';

const BASE_PATH = '/api/v1';
export const appRoutes = (app: Application): void => {
	app.use(`${BASE_PATH}/auth`, authRoutes());
	app.use(`${BASE_PATH}/user`, userRoutes());
}