import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { useScroll } from 'react-router-scroll';

import reducers from './reducers';
import { AUTH_USER, AUTH_ADMIN } from './actions/types';
import { Router, hashHistory, applyRouterMiddleware } from 'react-router';
import RouteComponent from './routes';
import './styles/style.scss';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
export const store = createStoreWithMiddleware(reducers);
const token = localStorage.getItem('token');
const isAdmin = localStorage.getItem('isAdmin');

// <Route path="/secret" component= {RequireAuth(Secret)} />
// if we have a token, consider the user to be signed in
if (token && isAdmin=='false') {
  store.dispatch({type: AUTH_USER})
}
if (token && isAdmin=='true') {
  store.dispatch({type: AUTH_ADMIN})
}
ReactDOM.render(
  <Provider store={store}>
    <Router
      render={applyRouterMiddleware(useScroll())}
      history={ hashHistory } 
      routes={RouteComponent}
      >
    </Router>
  </Provider>
  , document.getElementById('app'));
