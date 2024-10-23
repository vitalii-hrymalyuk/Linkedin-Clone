import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signup = async (req: Request, res: Response) => {
	try {
		const { name, username, email, password } = req.body;

		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			if (existingUser.email === email) {
				return res
					.status(400)
					.json({ message: 'User with this email already exists' });
			}
			if (existingUser.username === username) {
				return res
					.status(400)
					.json({ message: 'User with this username already exists' });
			}
			if (password.length < 6) {
				return res
					.status(400)
					.json({ message: 'Password must be at least 6 characters long' });
			}
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			username,
		});

		await user.save();

		const token = jwt.sign(
			{
				userId: user._id,
			},
			config.JWT_SECRET!,
			{ expiresIn: '3d' }
		);

		res.cookie('jwt-linkedin', token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: 'strict',
			secure: config.NODE_ENV === 'production',
		})

		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		console.log(`Error in signup: ${error}`)
		res.status(500).json({ message: 'Internal server error' });
	}


};

export const login = (req: Request, res: Response) => {
	res.send('login');
};

export const logout = (req: Request, res: Response) => {
	res.send('logout');
};
