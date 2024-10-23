import express from 'express';
import { config } from './config';

import authRoutes from './routes/auth.route'
import { connectDB } from './lib/db';

const app = express();
const port = config.PORT;

app.use(express.json());

app.use('api/v1/auth', authRoutes)

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
	connectDB();
});
