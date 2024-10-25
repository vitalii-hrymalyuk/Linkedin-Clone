import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../models/user.model';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../common/types/user.type'; 
import { config } from '../config';

export const protectRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token = req.cookies['jwt-linkedin'];

		if (!token) {
			res.status(401).json({ message: 'Unauthorized - No Token Provided' });
			return;
		}

		const decoded = jwt.verify(token, config.JWT_SECRET!) as JwtPayload;

		if (!decoded) {
			res.status(401).json({ message: 'Unauthorized - Invalid Token' });
			return; 
		}

		const user = await UserModel.findById(decoded.userId).select('-password');

		if (!user) {
			res.status(401).json({ message: 'User Not Found' });
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		console.log('Error in protectRoute middleware', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
