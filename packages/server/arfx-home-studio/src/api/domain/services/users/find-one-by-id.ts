import UserModel from '../../../models/user.model'
import {IUserEntity} from '../../entities/users'
export default () => (
  async (userId: string, projection: Partial<Record<keyof IUserEntity, 1|0>> = {}) => {
    try {
      // initiate user entity to run the validation for business rules.
      const user = await UserModel.findOne({
        _id: userId,
      }, projection)
      if (!user) {
        throw new Error('No User found.')
      }
      return user
    } catch (error) {
      throw error
    }
  }
)