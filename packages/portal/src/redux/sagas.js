import {all} from 'redux-saga/effects'
import SignInSaga from './sign-up/saga'
// import all saga here
export default function* () {
  yield all([
    SignInSaga()
    // put it here
  ])
}