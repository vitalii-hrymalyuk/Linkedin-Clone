export interface ISignUp {
	name: string;
	username: string;
	email: string;
	password: string;
}

export interface ILogin extends Pick<ISignUp, 'username' | 'password'> { }
