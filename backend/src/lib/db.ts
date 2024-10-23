import mongoose from 'mongoose'
import { config } from '../config'

export const connectDB = async () => {

	try {
		await mongoose.connect(config.MONGO_URI!)
		console.log(`MongoDB connected: ${config.MONGO_URI}`)
	} catch (error) {
		console.log(`Error connecting to MongoDB: ${error}`)
		process.exit(1)
	}
}