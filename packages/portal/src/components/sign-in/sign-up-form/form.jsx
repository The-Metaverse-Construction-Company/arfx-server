import React from 'react'
import {
  Link
} from 'react-router-dom'
const Form = ({
  formData,
  handleFormData,
  handleSendRequestButton
}) => {
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
          <button className='input-form-wrapper-button float-right' onClick={handleSendRequestButton}>Send Request</button>
        </div>
    </>
  )
}
export default Form