import { JwtPayload, SignOptions, sign, verify } from 'jsonwebtoken'
import { TokenType, UserStatus } from '~/constants/enums'

interface SignToken {
	payload: string | Buffer | object
	privateKey: string
	options?: SignOptions
}

interface VerifyToken {
	token: string
	privateKey: string
}

export interface TokenPayload extends JwtPayload {
	userId: string
	tokenType: TokenType
	verify: UserStatus
	exp: number
	iat: number
}

export const signToken = ({
	payload,
	privateKey,
	options = {
		algorithm: 'HS256'
	}
}: SignToken) => {
	return new Promise<string>((resolve, reject) => {
		sign(payload, privateKey, options, function (err, token) {
			if (err) {
				reject(err)
			}
			resolve(token as string)
		})
	})
}

export const verifyToken = ({ token, privateKey }: VerifyToken) => {
	return new Promise<TokenPayload>((resolve, reject) => {
		verify(token, privateKey, function (err, decode) {
			if (err) {
				reject(err)
			}

			resolve(decode as TokenPayload)
		})
	})
}
