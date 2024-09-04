export const UserStatus = {
	ACTIVATING: 'Activating',
	BANNED: 'Banned'
} as const

export const TokenTypes = {
	ACCESS_TOKEN: 0,
	REFRESH_TOKEN: 1
} as const

export const Roles = {
	SUPPERADMIN: 'SupperAdmin',
	ADMIN: 'Admin',
	USER: 'User'
} as const

export type Role = (typeof Roles)[keyof typeof Roles]
export type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes]
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]
