import React from 'react';
import './App.scss';

import MainComponents from './components/index'

import {Provider} from 'react-redux'
import store from './store-redux';
function App() {
  return (
    <div className="App">
      <Provider store={store} >
        <MainComponents />
      </Provider>
    </div>
  );
}

export default App;
