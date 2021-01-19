import UserModel from '../../../models/user.model'
export default () => (
  async (userId: string) => {
    try {
      // initiate user entity to run the validation for business rules.
      const user = await UserModel.findOne({
        _id: userId,
      })
      if (!user) {
        throw new Error('No User found.')
      }
      return user
    } catch (error) {
      throw error
    }
  }
)