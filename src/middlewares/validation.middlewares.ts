import { ZodError, ZodObject, ZodRawShape, z } from 'zod'
import { Request, Response, NextFunction, Locals } from 'express'
import { EntityError, ErrorsType } from '~/models/Errors'

function ZodErrorHandler(error: ZodError) {
	console.log(error.errors)
	const error_info: ErrorsType = {}
	error.errors.forEach((issue: z.ZodIssue) => {
		const key = issue.path[0]
		error_info[key] = {
			msg: issue.message,
			field: issue.path.join('.')
		}
	})

	return new EntityError({ error_info })
}

export function ZodBodyValidator<T extends ZodRawShape>(schema: ZodObject<T>) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.body)
			next()
		} catch (error) {
			if (error instanceof ZodError) {
				const handlerZodError = ZodErrorHandler(error)
				return next(handlerZodError)
			}
			next(error)
		}
	}
}

export function ZodHeadersValidator<T extends ZodRawShape>(
	schema: ZodObject<T>
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.headers)
			next()
		} catch (error) {
			if (error instanceof ZodError) {
				const handlerZodError = ZodErrorHandler(error)
				return next(handlerZodError)
			}
			next(error)
		}
	}
}

export function ZodQueryValidator<T extends ZodRawShape>(schema: ZodObject<T>) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.query)
			next()
		} catch (error) {
			if (error instanceof ZodError) {
				const handlerZodError = ZodErrorHandler(error)
				return next(handlerZodError)
			}
			next(error)
		}
	}
}

export function ZodParamValidator<T extends ZodRawShape>(schema: ZodObject<T>) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.params)
			next()
		} catch (error) {
			if (error instanceof ZodError) {
				const handlerZodError = ZodErrorHandler(error)
				return next(handlerZodError)
			}
			next(error)
		}
	}
}
