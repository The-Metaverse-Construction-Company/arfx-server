import React, { useEffect, useState } from 'react'
import {
  Switch,
  Route, 
  BrowserRouter as Router} from 'react-router-dom'
import TopNavigation from './top-navigation'
import {Fade} from 'react-bootstrap'
import MainComponents from './main'
import SignInComponents from './sign-in/index'
import PrivateRoute from '../helper/PrivatedRoutes'
import CompanyLogo from '../assets/images/arfx_logo.png'
// import Toast from '../utils/Toast'
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux'
function MainWrapper () {
  const [splashScreen, setSplashScreen] = useState(true)
  const [removeSplashScreen, setRemoveSplashScreen] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setSplashScreen(false)
      }, 500)
      // }, 2500)
  }, [])
  return (
      <>
      {!removeSplashScreen ? <Fade in={splashScreen} onExited={() => setRemoveSplashScreen(true)}>
        <div id='splash-screen'>
          <div id='company-logo-wrapper'><img alt='Logo' src={CompanyLogo} /></div>
        </div> 
      </Fade> : null}
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