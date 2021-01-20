import * as actionTypes from './action-types'
export const signUpAccount = ({
  email,
  password,
  name
}) => ({type: actionTypes.ACCOUNT_SIGN_UP_PENDING, payload: {email, password, name}})