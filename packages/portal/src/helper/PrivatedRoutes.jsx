import React from 'react'
import {Route, Redirect} from 'react-router-dom'
const PrivateRoute = ({component: Component, isAuthed, needAuthed, redirectTo, ...rest}) => {
  return (<Route {...rest} render={props => {
    return (isAuthed === needAuthed)
      ? <Component {...props} />
      : <Redirect to={{pathname: redirectTo, state: {from: props.location}}} />
  }} />)
}
export default PrivateRoute
