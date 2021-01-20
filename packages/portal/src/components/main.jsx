import React from 'react'
import {
  Switch,
  Route, 
  BrowserRouter as Router} from 'react-router-dom'
import TopNavigation from './top-navigation'
// import Toast from '../utils/Toast'
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux'
function MainWrapper () {
  return (
      <div>
        {/* <Router> */}
          <TopNavigation />
          Juan syets
            {/* <Switch>
              <Route path="/sign-in">
                <SignIn />
              </Route>
              <Route path="/todos">
                <Todos />
              </Route>
            </Switch> */}
        {/* </Router> */}
      </div>
  )
}
export default MainWrapper