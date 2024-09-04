import { ObjectId } from 'mongodb'
import { TokenTypes, UserStatus as UserStatusEnum } from '~/constants/enums'
import type { UserStatus } from '~/constants/enums'
import HttpStatus from '~/constants/httpStatus'
import { UsersMessage } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import RefreshToken from '~/models/schemas/RefreshToken.scheme'
import User from '~/models/schemas/User.schema'

import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { RegisterSchema } from '~/validators/auth.validators'

class AuthService {
	private signAccessToken({
		userId,
		verify
	}: {
		userId: string
		verify: UserStatus
	}) {
		return signToken({
			payload: {
				userId,
				verify,
				token_type: TokenTypes.ACCESS_TOKEN
			},
			privateKey: process.env.JWT_SECRET_ACCESS_TOKEN,
			options: {
				expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
			}
		})
	}

	private signRefreshToken({
		userId,
		verify,
		exp
	}: {
		userId: string
		verify: UserStatus
		exp?: number
	}) {
		if (!exp)
			return signToken({
				payload: {
					userId,
					verify,
					tokenType: TokenTypes.REFRESH_TOKEN
				},
				privateKey: process.env.JWT_SECRET_REFRESH_TOKEN,
				options: {
					expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
				}
			})
		return signToken({
			payload: {
				userId,
				verify,
				tokenType: TokenTypes.REFRESH_TOKEN,
				exp
			},
			privateKey: process.env.JWT_SECRET_REFRESH_TOKEN
		})
	}

	private signAccessAndRefreshToken({
		userId,
		verify
	}: {
		userId: string
		verify: UserStatus
	}) {
		return Promise.all([
			this.signAccessToken({ userId, verify }),
			this.signRefreshToken({ userId, verify })
		])
	}

	private decodeAccessToken(token: string) {
		return verifyToken({
			token,
			privateKey: process.env.JWT_SECRET_ACCESS_TOKEN
		})
	}

	private decodeRefreshToken(token: string) {
		return verifyToken({
			token,
			privateKey: process.env.JWT_SECRET_REFRESH_TOKEN
		})
	}

	async register(payload: RegisterSchema) {
		const userId = new ObjectId()

		const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
			userId: userId.toString(),
			verify: UserStatusEnum.ACTIVATING
		})

		const { exp, iat } = await this.decodeRefreshToken(refreshToken)

		await Promise.all([
			databaseService.refreshTokens.insertOne(
				new RefreshToken({
					userId,
					exp,
					iat,
					token: refreshToken,
					userName: payload.userName
				})
			),
			databaseService.users.insertOne(
				new User({
					...payload,
					_id: userId,
					password: hashPassword(payload.password)
				})
			)
		])

		return {
			accessToken,
			refreshToken
		}
	}

	async login(userName: string, password: string) {
		const user = await databaseService.users.findOne({
			userName,
			password: hashPassword(password)
		})
		if (user === null) {
			throw new ErrorWithStatus({
				status: HttpStatus.NOT_FOUND,
				message: UsersMessage.INCORRECT_USERNAME_OR_PASSWORD
			})
		}
		const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
			userId: user._id.toString(),
			verify: UserStatusEnum.ACTIVATING
		})
		const { exp, iat } = await this.decodeRefreshToken(refreshToken)

		await databaseService.refreshTokens.insertOne(
			new RefreshToken({
				userId: new ObjectId(user._id.toString()),
				token: refreshToken,
				userName: user.userName,
				exp,
				iat
			})
		)

		return {
			accessToken,
			refreshToken,
			role: user.role
		}
	}

	async logout(refreshToken: string) {
		await databaseService.refreshTokens.deleteOne({ token: refreshToken })
	}

	async refreshToken(
		user: User,
		verify: UserStatus,
		refreshToken: string,
		exp: number
	) {
		const userId = user._id?.toString()!

		const [newAccessToken, newRefreshToken] = await Promise.all([
			this.signAccessToken({ userId, verify }),
			this.signRefreshToken({ userId, verify, exp }),
			await databaseService.refreshTokens.deleteOne({ token: refreshToken })
		])

		const { iat } = await this.decodeRefreshToken(newRefreshToken)

		await databaseService.refreshTokens.insertOne(
			new RefreshToken({
				userId: new ObjectId(userId),
				token: newRefreshToken,
				userName: user.userName,
				exp,
				iat
			})
		)

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken
		}
	}
}

const authService = new AuthService()
export default authService
