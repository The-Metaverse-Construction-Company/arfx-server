import React, { useState } from 'react'
import {
  Link
} from 'react-router-dom'
import Http from '../../hooks/http.js'
import {SERVER_HOST} from '../../utils/constants'
function SignInFormComponents () {
  const [formData, setFormData] = useState(() => ({name: '', email: '', password: '', confirmPassword: ''}))
  const {data, isLoading} = Http({
    data: formData,
    url: `${SERVER_HOST}/api/auth/sign-up`,
    method: 'POST'
  })
  const handleFormData = (formField = {}) => {
    // get the previous data then merge the submitted form data.
    setFormData((prevValue) => ({...prevValue, ...formField}))
    console.log('formData :>> ', formData);
  }
  const handleSendRequestButton = () => {
    console.log('formData :>> ', formData);
  }
  return (
      <>
        <div>
            <span>Email</span><br/>
            <input type="text" name="" value={formData.email} onChange={(e) => handleFormData({email: e.target.value})}/>
          </div>
          <div>
            <span>Password</span><br/>
            <input type="password" name="" value={formData.password} onChange={(e) => handleFormData({password: e.target.value})}/>
          </div>
          <div>
            <span>Confirm Password</span><br/>
            <input type="password" name="" value={formData.confirmPassword} onChange={(e) => handleFormData({confirmPassword: e.target.value})}/>
          </div>
          <div className='input-form-wrapper-buttons'>
            <Link className='input-form-wrapper-button' to='/sign-in'>Cancel</Link>
            {/* <Link className='input-form-wrapper-button input-form-wrapper-button-input-form-wrapper' to='/sign-in/input-form-wrapper'>Send Request</Link> */}
            <button className='input-form-wrapper-button float-right'>Send Request</button>
          </div>
      </>
  )
}
export default SignInFormComponents