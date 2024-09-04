import { NextFunction, Response, Router, Request } from 'express'
import {
	loginController,
	logoutController,
	refreshTokenController,
	registerController
} from '~/controllers/auth.controllers'
import {
	checkAccessToken,
	checkRefreshToken
} from '~/middlewares/auth.middlewares'
import {
	ZodBodyValidator,
	ZodHeadersValidator
} from '~/middlewares/validation.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import {
	AccessTokenSchema,
	LoginSchema,
	RefreshTokenSchema,
	RegisterSchema
} from '~/validators/auth.validators'
const authRouter = Router()

/**
 * Description. Login account
 * Path: /users/login
 * Method: POST
 * Body: { userName: string, password: string  }
 */
authRouter.post(
	'/login',
	ZodBodyValidator(LoginSchema),
	wrapRequestHandler(loginController)
)

/**
 * Description. Register a new user
 * Path: /users/register
 * Method: POST
 * Body: { userName: string, password: string, name?: string  }
 */
authRouter.post(
	'/register',
	ZodBodyValidator(RegisterSchema),
	wrapRequestHandler(registerController)
)

/**
 * Description. Logout account
 * Path: /users/logout
 * Method: POST
 * Header: { Authorization: Bearer <accessToken> }
 * Body: { refreshToken: string }
 */
authRouter.post(
	'/logout',
	ZodHeadersValidator(AccessTokenSchema),
	checkAccessToken,
	ZodBodyValidator(RefreshTokenSchema),
	checkRefreshToken,
	wrapRequestHandler(logoutController)
)

/**
 * Description. Refresh Token
 * Path: /refresh-token
 * Method: POST
 * Body: { refreshToken: string}
 */
authRouter.post(
	'/refresh-token',
	ZodBodyValidator(RefreshTokenSchema),
	checkRefreshToken,
	wrapRequestHandler(refreshTokenController)
)

export default authRouter
