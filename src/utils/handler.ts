import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrapRequestHandler = <P, Q>(
	func: RequestHandler<P, any, any, Q>
) => {
	return (req: Request<P, any, any, Q>, res: Response, next: NextFunction) => {
		Promise.resolve(func(req, res, next)).catch(next)
	}
}
