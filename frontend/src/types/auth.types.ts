import { IConnection } from './connection.types';

export interface ISignUp {
	name: string;
	username: string;
	email: string;
	password: string;
}

export interface IUser {
	_id?: string;
	name: string;
	username?: string;
	email?: string;
	password?: string;
	profilePicture?: string;
	bannerImg?: string;
	headline?: string;
	location?: string;
	about?: string;
	skills?: string[];
	experience?: IExperience[];
	education?: IEducation[];
	connections?: IConnection[];
}

export interface IExperience {
	_id?: string;
	title: string;
	company: string;
	startDate: string;
	endDate: string;
	description: string;
	currentlyWorking: boolean;
}

export interface IEducation {
	_id?: string;
	school: string;
	fieldOfStudy: string;
	startYear: string;
	endYear: string;
}

export interface ILogin extends Pick<ISignUp, 'username' | 'password'> { }
