import { ObjectId } from 'mongodb'

interface IRefreshToken {
	_id?: ObjectId
	token: string
	createdAt?: Date
	userId: ObjectId
	userName: string
	iat: number
	exp: number
}

export default class RefreshToken {
	_id?: ObjectId
	token: string
	createdAt: Date
	userId: ObjectId
	userName: string
	iat: Date
	exp: Date

	constructor({
		_id,
		token,
		createdAt,
		userId,
		exp,
		iat,
		userName
	}: IRefreshToken) {
		this._id = _id
		this.token = token
		this.createdAt = createdAt || new Date()
		this.userId = userId
		this.userName = userName
		this.iat = new Date(iat * 1000)
		this.exp = new Date(exp * 1000)
	}
}
