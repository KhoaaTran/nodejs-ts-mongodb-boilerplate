import { Request } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HttpStatus from '~/constants/httpStatus'
import { UsersMessage } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyToken } from './jwt'

export const verifyAccessToken = async (token: string, req?: Request) => {
	try {
		if (!token) {
			throw new ErrorWithStatus({
				message: UsersMessage.ACCESS_TOKEN_IS_REQUIRED,
				status: HttpStatus.UNAUTHORIZED
			})
		}

		const decodedAccessToken = await verifyToken({
			token,
			privateKey: process.env.JWT_SECRET_ACCESS_TOKEN
		})
		if (req) {
			;(req as Request).decodedAccessToken = decodedAccessToken
		}

		return decodedAccessToken
	} catch (err) {
		throw new ErrorWithStatus({
			message: capitalize((err as JsonWebTokenError).message),
			status: HttpStatus.UNAUTHORIZED
		})
	}
}
