import {createStore, applyMiddleware} from 'redux'
import rootReducers from './redux/reducers'

// import createSagaMiddleware from 'redux-saga'
// import rootSaga from './redux/sagas'
// import {IFetchOrderAction} from './redux/sign-in/interfaces'

// const sagaMiddleware = createSagaMiddleware()

// export type AppState = ReturnType<typeof rootReducers>
const store = createStore(
    rootReducers,
    // applyMiddleware(sagaMiddleware)
  )
// sagaMiddleware.run(rootSaga)
export default store