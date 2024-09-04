export const CommonMessage = {
	VALIDATION_ERROR: 'Validation error',
	REQUIRED_A_STRING: 'This field must be a string',
	IS_REQUIRED: 'This field is required',
	FORBIDDEN_REQ: 'This req is not allowed by our CORS Policy.'
} as const

export const UsersMessage = {
	LOGIN_SUCCESS: 'Login successfully',
	REGISTER_SUCCESS: 'Register successfully',
	LOGOUT_SUCCESS: 'Logout successfully',

	REGISTER_FAIL: 'Registration failed',

	ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
	ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',

	REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
	REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
	REFRESH_SUCCESS: 'Refresh token successfully',

	USERNAME_MUST_BE_A_STRING: 'Username must be a string',
	USERNAME_IS_REQUIRED: 'Username is required',
	USERNAME_ALREADY_EXISTS: 'Username already exists',

	USER_NOT_FOUND: 'User not found',

	PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
	PASSWORD_IS_REQUIRED: 'Password is required',

	INCORRECT_USERNAME_OR_PASSWORD: 'Username or password is incorrect'
} as const
