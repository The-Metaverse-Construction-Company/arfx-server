
import UserModel from '../../models/user.model'
export default ({
  sendEmail
}: any) => (
  class SendEmailVerification {
    constructor () {
    }
    sendOne = async ({
      userId = '',
      email = '',
      name = '',
      token = ''
    }) => {
      try {
        // initiate user entity to run the validation for business rules.
        // insert to repository.
        const user = await UserModel.findOne({_id: userId})
        // if the email is already verified, then skip sending email.
        if (user && !user.email.verified) {
          sendEmail({
            name,
            token,
            email
          })
        }
        //add some logs
        return true
      } catch (error) {
        console.log('error :>> ', error);
        throw error
      }
    }
  }
)