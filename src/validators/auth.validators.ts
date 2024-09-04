import { z } from 'zod'
import { Roles } from '~/constants/enums'
import { CommonMessage, UsersMessage } from '~/constants/messages'

export const LoginSchema = z
	.object({
		userName: z
			.string({ message: CommonMessage.REQUIRED_A_STRING })
			.min(1, { message: CommonMessage.IS_REQUIRED }),
		password: z
			.string({ message: CommonMessage.REQUIRED_A_STRING })
			.min(1, { message: CommonMessage.IS_REQUIRED })
	})
	.strict()

export type LoginSchema = z.infer<typeof LoginSchema>

export const RegisterSchema = z
	.object({
		userName: z
			.string({ message: CommonMessage.REQUIRED_A_STRING })
			.min(1, { message: CommonMessage.IS_REQUIRED }),
		password: z
			.string({ message: CommonMessage.REQUIRED_A_STRING })
			.min(1, { message: CommonMessage.IS_REQUIRED }),
		name: z
			.string({ message: CommonMessage.REQUIRED_A_STRING })
			.min(1, { message: CommonMessage.IS_REQUIRED })
			.optional(),
		role: z.nativeEnum(Roles).optional()
	})
	.strict()

export type RegisterSchema = z.infer<typeof RegisterSchema>

export const AccessTokenSchema = z.object({
	authorization: z
		.string({ message: UsersMessage.ACCESS_TOKEN_IS_REQUIRED })
		.min(1, { message: CommonMessage.IS_REQUIRED })
})

export type AccessTokenSchema = z.infer<typeof AccessTokenSchema>

export const RefreshTokenSchema = z
	.object({
		refreshToken: z
			.string({ message: UsersMessage.REFRESH_TOKEN_IS_REQUIRED })
			.min(1, { message: CommonMessage.IS_REQUIRED })
	})
	.strict()

export type RefreshTokenSchema = z.infer<typeof RefreshTokenSchema>
