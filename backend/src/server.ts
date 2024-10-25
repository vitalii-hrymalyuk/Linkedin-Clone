import { Application } from 'express';
import { appRoutes } from './routes/routes';
import { config } from './config';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';

const SERVER_PORT = config.PORT || 5000;

export const start = (app: Application) => {
	standardMiddleware(app);
	routesMiddleware(app);
	startServer(app);
}

const routesMiddleware = (app: Application): void => {
	appRoutes(app);
}

const standardMiddleware = (app: Application): void => {
	app.use(express.json());
	app.use(cookieParser())
}

const startServer = (app: Application): void => {
	try {
		const httpServer: http.Server = new http.Server(app);

		httpServer.listen(SERVER_PORT, () => {
			console.log(`Server started on port ${SERVER_PORT}`)
		})
	} catch (error) {
		console.log('Error starting server', error)
	}
}