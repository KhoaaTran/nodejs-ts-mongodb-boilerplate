import { ObjectId } from 'mongodb'
import { UserStatus } from '~/constants/enums'
import databaseService from '~/services/database.services'

class UsersService {
	async userNameExist(userName: string) {
		const result = await databaseService.users.findOne({
			userName
		})

		return Boolean(result)
	}

	async userIdExist(user_id: string) {
		const result = await databaseService.users.findOne({
			_id: new ObjectId(user_id)
		})

		if (!result || result.verify === UserStatus.BANNED) {
			return false
		}

		return true
	}
}

const usersService = new UsersService()
export default usersService
