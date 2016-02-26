import 'babel-polyfill';
import 'whatwg-fetch';
import { values } from 'lodash';
import React from 'react';
import { render } from 'react-dom';
import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer';
import Root from './Root';
import DevTools from './DevTools';
import * as sagas from './sagas/watchers';


const sagaMiddleware = createSagaMiddleware(...values(sagas));

const enhancer = compose(
  applyMiddleware(sagaMiddleware),
  DevTools.instrument()
);

const store = createStore(
  reducer,
  undefined,
  enhancer
);

render(
  <Root store={store} />,
  document.getElementById('root')
);

store.dispatch({ type: 'APP_INITIALIZED' });
