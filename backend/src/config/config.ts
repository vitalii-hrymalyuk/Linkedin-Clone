import dotenv from 'dotenv'

dotenv.config({})

class Config {
	public PORT: number | undefined;
	public MONGO_URI: string | undefined;

	constructor() {
		this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
		this.MONGO_URI = process.env.MONGO_URI || '';
	}
}

export const config: Config = new Config();