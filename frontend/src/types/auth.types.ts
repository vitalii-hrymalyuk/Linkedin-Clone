export interface ISignUp {
	name: string;
	username: string;
	email: string;
	password: string;
}

export interface IUser {
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
	connections?: string[];
}

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

export interface ILogin extends Pick<ISignUp, 'username' | 'password'> { }