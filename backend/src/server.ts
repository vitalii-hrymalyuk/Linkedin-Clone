import { Application, Request, Response } from 'express';
import { appRoutes } from './routes/routes';
import { config } from './config';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

const SERVER_PORT = config.PORT || 5000;

export const start = (app: Application) => {
	standardMiddleware(app);
	routesMiddleware(app);
	serveFrontend(app);
	startServer(app);
}

const routesMiddleware = (app: Application): void => {
	appRoutes(app);
}

const standardMiddleware = (app: Application): void => {
	if (config.NODE_ENV !== 'production') {
		app.use(cors({
			origin: config.CLIENT_URL,
			credentials: true,
		}))
	}

	app.use(express.json({ limit: '5mb' }));
	app.use(cookieParser())
}

const serveFrontend = (app: Application): void => {
	const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
	app.use(express.static(frontendPath));

	// Catch-all route to serve the index.html for frontend routing
	app.get('*', (_req: Request, res: Response) => {
		res.sendFile(path.join(frontendPath, 'index.html'));
	});
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