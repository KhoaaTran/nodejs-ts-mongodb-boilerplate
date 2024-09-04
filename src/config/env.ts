import 'dotenv/config'
import z from 'zod'

const envSchema = z
	.object({
		DATABASE_URL: z.string().trim().min(1),
		PASSWORD_SECRET: z.string().trim().min(1),
		DB_USER_COLLECTION: z.string().trim().min(1),
		DB_REFRESH_TOKEN_COLLECTION: z.string().trim().min(1),
		JWT_SECRET_ACCESS_TOKEN: z.string().trim().min(1),
		JWT_SECRET_REFRESH_TOKEN: z.string().trim().min(1),
		ACCESS_TOKEN_EXPIRES_IN: z.string().trim().min(1),
		REFRESH_TOKEN_EXPIRES_IN: z.string().trim().min(1),
		PORT: z.coerce.number()
	})
	.strict()

const env = envSchema.safeParse({
	DATABASE_URL: process.env.DATABASE_URL,
	PASSWORD_SECRET: process.env.PASSWORD_SECRET,
	DB_USER_COLLECTION: process.env.DB_USER_COLLECTION,
	DB_REFRESH_TOKEN_COLLECTION: process.env.DB_REFRESH_TOKEN_COLLECTION,
	JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN,
	JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN,
	ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
	REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
	PORT: process.env.PORT
})

if (!env.success) {
	console.error(env.error.issues)
	throw new Error('Environment variables is not suitable')
	process.exit(1)
}

export type EnvSchemaType = z.infer<typeof envSchema>
export default env
