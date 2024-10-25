import express, { Express } from 'express'
import { start } from './server';
import { connectDB } from './lib/db';

const initialize = (): void => {
	connectDB();
	const app: Express = express();
	start(app);
}

initialize();