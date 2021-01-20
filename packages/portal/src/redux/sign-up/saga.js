import {put, all, call, takeLatest} from 'redux-saga/effects'
import * as actionTypes from './action-types'
import {signInAccount} from './api'
function * signUpWorker (data) {
  try {
    const res = yield call(signInAccount, data)
    yield put ({
      type: actionTypes.ACCOUNT_SIGN_UP_SUCCEED,
      data: res
    })
  } catch (err) {
    yield put({
      type: actionTypes.ACCOUNT_SIGN_UP_FAILED,
      error: err.message
    })
  }
}
export default function* () {
  yield all([
      takeLatest(actionTypes.ACCOUNT_SIGN_UP_PENDING, signUpWorker),
    ])
  }
  