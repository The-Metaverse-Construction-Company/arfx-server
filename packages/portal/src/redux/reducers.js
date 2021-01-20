import {combineReducers} from 'redux'
import { SignUpAccountReducer } from './sign-up/reducer'
// import reducers here
export default combineReducers({
    signUpAccountReducer: SignUpAccountReducer
    // validateAuthentication: validateAuthenticationReducer,
})