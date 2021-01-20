import React from 'react'
import {
  Link,} from 'react-router-dom'
function SignInFormComponents (props) {
  console.log('props :>> ', props);
  return (
      <>
        <div>
          <span>Username</span><br/>
          <input type="text" name="" id=""/>
        </div>
        <div>
          <span>Password</span><br/>
          <input type="text" name="" id=""/>
        </div>
        <div className='input-form-wrapper-buttons'>
          <Link className='input-form-wrapper-button' to='/sign-in/reset-password'>Forgot Password</Link>
          <Link className='input-form-wrapper-button float-right' to='/sign-in/sign-up'>Sign Up</Link>
          {/* <button className='sign-in-button-sign-up'>Sign Up</button> */}
        </div>
      </>
  )
}
export default SignInFormComponents