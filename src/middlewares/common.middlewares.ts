import { NextFunction, Request, Response } from 'express'
import pick from 'lodash/pick'

type FilterKeys<T> = (keyof T)[]

export const filterMiddleware =
	<T>(filterKeys: FilterKeys<T>) =>
	(req: Request, res: Response, next: NextFunction) => {
		req.body = pick(req.body, filterKeys)
		next()
	}
