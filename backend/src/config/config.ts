import dotenv from 'dotenv'

dotenv.config({})

class Config {
	public PORT: number | undefined;
	public MONGO_URI: string | undefined;
	public JWT_SECRET: string | undefined;
	public NODE_ENV: string | undefined;

	constructor() {
		this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
		this.MONGO_URI = process.env.MONGO_URI || '';
		this.JWT_SECRET = process.env.JWT_SECRET || '';
		this.NODE_ENV = process.env.NODE_ENV || '';
	}
}

export const config: Config = new Config();