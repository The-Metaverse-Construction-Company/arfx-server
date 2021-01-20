import React from 'react'
import {
  Link,} from 'react-router-dom'
const FormComponents = () => (
  <div className='reset-password-wrapper'>
    <div className='reset-password-wrapper-header'>
      <span className='reset-password-wrapper-header-title'>Password Reset</span>
      <p className='reset-password-wrapper-header-description'>
        Please enter your email address and a password reset link will be sent to you.
      </p>
    </div>

    <div className='reset-password-form-wrapper'>
      <span className='reset-password-form-wrapper-label'>Email Address</span><br />
      <input type="text" name="" id=""/><br/>
      <Link className='input-form-wrapper-button reset-password-form-wrapper-button' to='/sign-in'>Cancel</Link>
    </div>
  </div>
)
const SuccessComponent = () => (
  <div className='reset-password-wrapper'>
    <div className='reset-password-wrapper-header'>
      <span className='reset-password-wrapper-header-title'>Password Reset</span>
      <p className='reset-password-wrapper-header-description'>
        An Email sent to email@mail.com
      </p>
      <Link className='input-form-wrapper-button reset-password-form-wrapper-button' to='/sign-in'>Back</Link>
    </div>
  </div>
)
function SignInFormComponents () {
  return (
      <>
        <FormComponents />
        <SuccessComponent />
      </>
  )
}
export default SignInFormComponents