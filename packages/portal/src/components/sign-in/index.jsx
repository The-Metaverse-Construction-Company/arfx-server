import React from 'react'
import './style.scss'

import CompanyLogo from '../../assets/images/arfx_logo.png'
import { Button } from 'react-bootstrap'
import {
  Route,
  Switch,} from 'react-router-dom'
import SignInFormComponents from './sign-in-form'
import SignUpFormComponents from './sign-up-form/index'
import ResetPaswordFormComponents from './reset-password-form'
// import Toast from '../utils/Toast'
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux'
function SignInComponents () {
  return (
      <>
        <div id='signin-container'>
          <div className="signin-wrapper">
            <div className='sign-in-form-wrapper'>
              <div className='sign-in-logo'>
                <img alt = 'Company' className ='company-logo' src={CompanyLogo} />
              </div>
              <div className="input-form-wrapper">
                <Switch>
                  <Route exact path='/sign-in'>
                    <SignInFormComponents />
                  </Route>
                  <Route exact path='/sign-in/sign-up'>
                    <SignUpFormComponents />
                  </Route>
                  <Route exact path='/sign-in/reset-password'>
                    <ResetPaswordFormComponents />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </>
  )
}
export default SignInComponents