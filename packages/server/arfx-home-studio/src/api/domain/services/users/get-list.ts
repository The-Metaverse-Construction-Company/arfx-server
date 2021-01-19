import {
  UserEntity
} from '../../entities'
import UserModel from '../../../models/user.model'
interface IPaginationListParams {
  page: number
  perPage: number,
  name: string
  email: string
  role: string
}
export default () => (
  async ({page = 1, perPage = 30, name = '', email = '', role}: Partial<IPaginationListParams>) => {
    try {
      const query = {
        name: new RegExp(name, 'i'),
        "email.value": new RegExp(email, 'i')
      }
      const list = await UserModel.find(query, {
        password: 0
      })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();

      return list
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
)