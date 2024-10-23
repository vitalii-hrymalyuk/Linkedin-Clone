import { ObjectId } from 'mongoose';

interface Experience {
	title: string;
	company: string;
	startDate: Date;
	endDate: Date;
	description: string;
}

interface Education {
	school: string;
	fieldOfStudy: string;
	startYear: number;
	endYear: number;
}

interface IUser {
	_id?: ObjectId;
	name: string;
	username: string;
	email: string;
	password: string;
	profilePicture?: string;
	bannerImg?: string;
	headline?: string;
	location?: string;
	about?: string;
	skills?: string[];
	experience?: Experience[];
	education?: Education[];
	connections?: ObjectId[];
}

export default IUser;
