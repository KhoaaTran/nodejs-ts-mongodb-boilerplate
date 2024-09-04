import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UsersMessage } from '~/constants/messages'
import authService from '~/services/auth.services'
import {
	LoginSchema,
	RefreshTokenSchema,
	RegisterSchema
} from '~/validators/auth.validators'

export const loginController = async (
	req: Request<ParamsDictionary, any, LoginSchema>,
	res: Response
) => {
	const { userName, password } = req.body

	const data = await authService.login(userName, password)

	return res.json({
		message: UsersMessage.LOGIN_SUCCESS,
		data
	})
}

export const registerController = async (
	req: Request<ParamsDictionary, any, RegisterSchema>,
	res: Response
) => {
	const { userName, password } = req.body
	const data = await authService.register({ userName, password })

	return res.json({
		message: UsersMessage.REGISTER_SUCCESS,
		data
	})
}

export const logoutController = async (
	req: Request<ParamsDictionary, any, RefreshTokenSchema>,
	res: Response
) => {
	const { refreshToken } = req.body
	await authService.logout(refreshToken)
	return res.json({
		message: UsersMessage.LOGOUT_SUCCESS
	})
}

export const refreshTokenController = async (
	req: Request<ParamsDictionary, any, RefreshTokenSchema>,
	res: Response
) => {
	const { refreshToken } = req.body
	const { verify, exp } = req.decodedRefreshToken
	const user = req.user!

	const data = await authService.refreshToken(user, verify, refreshToken, exp)
	return res.json({
		message: UsersMessage.REFRESH_SUCCESS,
		data
	})
}
