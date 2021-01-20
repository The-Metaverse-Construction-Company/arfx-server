import React from 'react'
import {
  Switch,
  Route, 
  BrowserRouter as Router} from 'react-router-dom'
import TopNavigation from './top-navigation'

import MainComponents from './main'
import SignInComponents from './sign-in/index'
import PrivateRoute from '../helper/PrivatedRoutes'
// import Toast from '../utils/Toast'
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux'
function MainWrapper () {
  return (
      <>
       <Router>
          <Switch>
            <PrivateRoute path='/sign-in' component={SignInComponents} needAuthed={false} isAuthed={false} redirectTo={'/'} />
            <PrivateRoute path='/' component={MainComponents} needAuthed={true} isAuthed={false} redirectTo={'/sign-in'} />
          </Switch>
        </Router>
      </>
  )
}
export default MainWrapper