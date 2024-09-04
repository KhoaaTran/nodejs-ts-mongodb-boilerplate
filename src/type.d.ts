import { Request } from 'express'
import { EnvSchemaType } from '~/config/env'
import User from '~/models/schemas/User.schema'
import { TokenPayload } from '~/models/types/users'

declare module 'express' {
	interface Request {
		user?: User
		decodedAccessToken?: TokenPayload
		decodedRefreshToken?: TokenPayload
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvSchemaType {}
	}
}
