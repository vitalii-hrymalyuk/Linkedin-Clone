import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import UserModel from '../models/user.model';

export const signup = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, username, email, password } = req.body;

		if (!name || !username || !email || !password) {
			res.status(400).json({ message: 'All fields are required' });
			return;
		}

		if (password.length < 6) {
			res.status(400).json({ message: 'Password must be at least 6 characters long' });
			return;
		}

		const existingUser = await UserModel.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			if (existingUser.email === email) {
				res.status(400).json({ message: 'User with this email already exists' });
				return;
			}
			if (existingUser.username === username) {
				res.status(400).json({ message: 'User with this username already exists' });
				return;
			}
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await UserModel.create({
			name,
			email,
			password: hashedPassword,
			username,
		});

		const token = jwt.sign(
			{
				userId: user._id,
			},
			config.JWT_SECRET!,
			{ expiresIn: '3d' }
		);

		res.cookie('jwt-linkedin', token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
			sameSite: 'strict', // prevent CSRF attacks
			secure: config.NODE_ENV === 'production', // prevents man-in-the-middle attacks
		});

		res.status(201).json({ message: 'User registered successfully' });


	} catch (error) {
		// Log the error (Consider using a logging library)
		console.error(`Error in signup: ${error}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const login = (req: Request, res: Response) => {
	res.send('login');
};

export const logout = (req: Request, res: Response) => {
	res.send('logout');
};
