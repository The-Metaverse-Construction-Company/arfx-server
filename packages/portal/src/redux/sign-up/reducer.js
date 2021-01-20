import * as actionTypes from './action-types'
import { DEFAULT_REDUCER_STATUSES } from '../../utils/constants'
console.log('actionTypes :>> ', actionTypes);
const initialState = {
  data: {
    _id: '',
    name: '',
    email: '',
    createdAt: 0,
    updatedAt: 0,
  },
  status: DEFAULT_REDUCER_STATUSES.IDLE,
  error: null,
  retry: 0
}
export const SignUpAccountReducer = (state = initialState, actions) => {
  const {type, payload, error} = actions
  switch (type) {
    case actionTypes.ACCOUNT_SIGN_UP_PENDING:
      return {
        ...state,
        status: DEFAULT_REDUCER_STATUSES.FETCHING,
        retry: state.retry + 1
      }
    case actionTypes.ACCOUNT_SIGN_UP_SUCCEED:
      return {
        ...state,
        data: payload,
        status: DEFAULT_REDUCER_STATUSES.FETCHED
      }
    case actionTypes.ACCOUNT_SIGN_UP_FAILED:
      return {
        ...state,
        error,
        status: DEFAULT_REDUCER_STATUSES.FAILED
      }
    default:
      return state
  }
}
