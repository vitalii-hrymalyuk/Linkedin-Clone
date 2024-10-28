import { Request, Response } from 'express';
import { AuthenticatedRequest, ProfileUpdate } from '../common/types/user.type';
import UserModel from '../models/user.model';
import cloudinary from '../lib/cloudinary';

export const getSuggestedConnections = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	try {
		const currentUser = await UserModel.findById(req.user?._id).select(
			'connections'
		);

		const suggestedUsers = await UserModel.find({
			_id: {
				$ne: req.user?._id,
				$nin: currentUser?.connections,
			},
		})
			.select('name username profilePicture headline')
			.limit(3);

		res.json(suggestedUsers);
	} catch (error) {
		console.error(`Error in getSuggestedConnection: ${error}`);
		res.status(500).send({ message: 'Server error' });
	}
};
export const getPublicProfile = async (req: Request, res: Response) => {
	try {
		const user = await UserModel.findOne({
			username: req.params.username,
		}).select('-password');

		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		} else {
			res.json(user);
		}
	} catch (error) {
		console.error(`Error in getPublicProfile: ${error}`);
		res.status(500).send({ message: 'Server error' });
	}
};
export const updateProfile = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	try {
		const allowedFields: (keyof ProfileUpdate)[] = [
			'name',
			'headline',
			"username",
			'about',
			'location',
			'profilePicture',
			'bannerImg',
			'skills',
			'experience',
			'education',
		];

		const updatedData: Partial<ProfileUpdate> = {};

		allowedFields.forEach((field) => {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		});

		if (req.body.profilePicture) {
			const result = await cloudinary.uploader.upload(req.body.profilePicture)
			updatedData.profilePicture = result.secure_url;
		}

		if (req.body.bannerImg) {
			const result = await cloudinary.uploader.upload(req.body.bannerImg)
			updatedData.bannerImg = result.secure_url;
		}

		const user = await UserModel.findByIdAndUpdate(
			req.user?._id,
			{ $set: updatedData },
			{ new: true }
		).select('-password');

		res.json(user);
	} catch (error) {
		console.error(`Error in updateProfile: ${error}`);
		res.status(500).send({ message: 'Server error' });
	}
};
