import dotenv from 'dotenv'

dotenv.config({})

class Config {
	public PORT: number | undefined;
	public MONGO_URI: string | undefined;
	public JWT_SECRET: string | undefined;
	public NODE_ENV: string | undefined;
	public MAILTRAP_TOKEN: string | undefined;
	public EMAIL_FROM: string | undefined;
	public EMAIL_FROM_NAME: string | undefined;
	public CLIENT_URL: string | undefined;
	public CLOUDINARY_API_KEY: string | undefined
	public CLOUDINARY_API_SECRET: string | undefined;
	public CLOUDINARY_CLOUD_NAME: string | undefined;

	constructor() {
		this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
		this.MONGO_URI = process.env.MONGO_URI || '';
		this.JWT_SECRET = process.env.JWT_SECRET || '';
		this.NODE_ENV = process.env.NODE_ENV || '';
		this.MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN || '';
		this.EMAIL_FROM = process.env.EMAIL_FROM || '';
		this.EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || '';
		this.CLIENT_URL = process.env.CLIENT_URL || '';
		this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
		this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
		this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
	}
}

export const config: Config = new Config();