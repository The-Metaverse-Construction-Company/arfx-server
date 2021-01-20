import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import {signUpAccount} from '../../../redux/sign-up/actions'
import { useSelector} from 'react-redux'
import Form from './form'

function SignInFormComponents () {
  const [formData, setFormData] = useState(() => ({name: '', email: '', password: '', confirmPassword: ''}))
  const signUpAccountDispatcher = useDispatch()
  const TodoList = useSelector((state) => state.signUpAccountReducer)
  const handleFormData = (formField = {}) => {
    // get the previous data then merge the submitted form data.
    setFormData((prevValue) => ({...prevValue, ...formField}))
  }
  const handleSendRequestButton = () => {
    signUpAccountDispatcher(signUpAccount(formData))
  }
  return <Form
    handleSendRequestButton={handleSendRequestButton}
    handleFormData={handleFormData}
    formData={formData}
    />
}
export default SignInFormComponents