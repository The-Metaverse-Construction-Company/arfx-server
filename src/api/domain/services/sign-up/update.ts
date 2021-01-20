import { IRevokeToken } from '../../interfaces'
import { TOKEN_TYPE } from '../../../utils/constants'
import {FindOneById} from '../users'
interface Deps {
  revokeToken: IRevokeToken
  findOneById: ReturnType<typeof FindOneById>
}
export default class VerifiedUu {
  constructor (protected deps: Deps) {
  }
  public updateOne = async (userId: string) => {
    try {
      const user = await this.deps.findOneById(userId, {password: 0})
      user.email.verified = true
      user.email.verifiedAt = Date.now()
      await this.deps.revokeToken(userId, TOKEN_TYPE.SIGN_UP)
      await user.save()
      //add some logs
      return user
    } catch (error) {
      throw error
    }
  }
}