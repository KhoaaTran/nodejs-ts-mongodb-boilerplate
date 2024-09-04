import { Collection, Db, MongoClient } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.scheme'
import User from '~/models/schemas/User.schema'

class DatabaseService {
	private client: MongoClient
	private db: Db

	constructor() {
		this.client = new MongoClient(process.env.DATABASE_URL)
		this.db = this.client.db('dev')
	}

	async connect() {
		try {
			await this.db.command({ ping: 1 })
			console.log('You successfully connected to MongoDB!')
		} catch {
			await this.client.close()
		}
	}

	get users(): Collection<User> {
		return this.db.collection(process.env.DB_USER_COLLECTION)
	}

	get refreshTokens(): Collection<RefreshToken> {
		return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION)
	}
}

const databaseService = new DatabaseService()
export default databaseService
