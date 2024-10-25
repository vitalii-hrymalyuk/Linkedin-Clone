import { Application } from 'express';
import { authRoutes } from './auth.route';
export const appRoutes = (app: Application): void => {
	app.use('/api/v1/auth', authRoutes());
}