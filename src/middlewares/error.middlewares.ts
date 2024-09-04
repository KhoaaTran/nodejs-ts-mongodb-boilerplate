import { NextFunction, Request, Response } from 'express'
import HttpStatus from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import omit from 'lodash/omit'

export const defaultErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ErrorWithStatus) {
		return res.status(err.status).json(omit(err, ['status']))
	}

	return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
		errors: err.message
	})
}
