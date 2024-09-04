import { CorsOptions } from 'cors'
import HttpStatus from '~/constants/httpStatus'
import { CommonMessage } from '~/constants/messages'
import { WHITELIST_DOMAINS } from '~/constants/others'
import { ErrorWithStatus } from '~/models/Errors'

const corsOptions: CorsOptions = {
	origin: function (origin, callback) {
		if (!origin || WHITELIST_DOMAINS.includes(origin)) {
			return callback(null, true)
		}
		throw new ErrorWithStatus({
			message: CommonMessage.FORBIDDEN_REQ,
			status: HttpStatus.FORBIDDEN
		})
	},

	optionsSuccessStatus: 200,
	credentials: true
}

export default corsOptions
