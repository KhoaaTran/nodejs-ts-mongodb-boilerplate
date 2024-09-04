import { NextFunction, Request, Response } from 'express'
import HttpStatus from '~/constants/httpStatus'
import { UsersMessage } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyAccessToken } from '~/utils/commons'
import { verifyToken } from '~/utils/jwt'
import { RefreshTokenSchema } from '~/validators/auth.validators'
import { ParamsDictionary } from 'express-serve-static-core'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { UserStatus } from '~/constants/enums'

export const checkAccessToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const bearerToken = req.headers.authorization as string
		const token: string = bearerToken.split(' ')[1]
		const decodedAccessToken = await verifyAccessToken(token)
		req.decodedAccessToken = decodedAccessToken
		next()
	} catch (err) {
		next(
			new ErrorWithStatus({
				message: UsersMessage.ACCESS_TOKEN_IS_INVALID,
				status: HttpStatus.UNAUTHORIZED
			})
		)
	}
}

export const checkRefreshToken = async (
	req: Request<ParamsDictionary, any, RefreshTokenSchema>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { refreshToken } = req.body
		const [decodedRefreshToken, refreshTokenDB] = await Promise.all([
			verifyToken({
				token: refreshToken,
				privateKey: process.env.JWT_SECRET_REFRESH_TOKEN
			}),
			databaseService.refreshTokens.findOne({ token: refreshToken })
		])

		if (refreshTokenDB === null) {
			throw new ErrorWithStatus({
				message: UsersMessage.REFRESH_TOKEN_IS_INVALID,
				status: HttpStatus.UNAUTHORIZED
			})
		}

		const user = await databaseService.users.findOne({
			_id: new ObjectId(decodedRefreshToken.userId)
		})

		if (!user || user.verify === UserStatus.BANNED) {
			throw new ErrorWithStatus({
				message: UsersMessage.USER_NOT_FOUND,
				status: HttpStatus.NOT_FOUND
			})
		}

		req.decodedRefreshToken = decodedRefreshToken
		req.user = user
		next()
	} catch (err) {
		next(
			new ErrorWithStatus({
				message: UsersMessage.ACCESS_TOKEN_IS_INVALID,
				status: HttpStatus.UNAUTHORIZED
			})
		)
	}
}
