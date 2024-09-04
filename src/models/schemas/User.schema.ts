import { ObjectId } from 'mongodb'
import { Roles, UserStatus } from '~/constants/enums'
import type { Role } from '~/constants/enums'
import type { RegisterSchema } from '~/validators/auth.validators'

export default class User {
	_id?: ObjectId
	createdAt: Date
	updatedAt: Date
	verify: UserStatus
	name?: string
	userName: string
	password: string
	role: Role

	constructor({
		_id,
		password,
		userName,
		name,
		role
	}: RegisterSchema & { _id?: ObjectId }) {
		const date = new Date()
		this._id = _id
		this.createdAt = date
		this.updatedAt = date
		this.userName = userName
		this.password = password
		this.name = name || ''
		this.verify = UserStatus.ACTIVATING
		this.role = role || Roles.USER
	}
}
