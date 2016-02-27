import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createSagaDispatcher from './sagaDispatcher';
import reducer from './reducer';
import Root from './Root';
import DevTools from './DevTools';
import rootSaga, { loadData } from './sagas';


const sagaMiddleware = createSagaMiddleware(rootSaga);
const sagaDispatcher = createSagaDispatcher(sagaMiddleware);

const enhancer = compose(
  applyMiddleware(sagaMiddleware, sagaDispatcher),
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

store.dispatch(loadData);
