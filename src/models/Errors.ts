import HttpStatus from '~/constants/httpStatus'
import { CommonMessage } from '~/constants/messages'

export type ErrorsType = Record<
	string,
	{
		msg: string
		[key: string]: any
	}
>

export class ErrorWithStatus {
	message: string
	status: number
	constructor({ message, status }: { message: string; status: number }) {
		this.message = message
		this.status = status
	}
}

export class EntityError extends ErrorWithStatus {
	error_info: ErrorsType
	constructor({
		error_info
	}: {
		message?: string
		status?: number
		error_info: ErrorsType
	}) {
		super({
			message: CommonMessage.VALIDATION_ERROR,
			status: HttpStatus.UNPROCESSABLE_ENTITY
		})
		this.error_info = error_info
	}
}
