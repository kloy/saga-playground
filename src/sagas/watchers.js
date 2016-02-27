import { keys } from 'lodash';
import { sendShipment } from './boxcar';
import { take, call, put, race, fork, cancel } from 'redux-saga/effects';
import { read } from '../request';


export function* helloSaga() {
  console.log('Hello Sagas!');
}

export function* watchInit() {
  yield take('APP_INITIALIZED');
  const response = yield call(read);
  const json = yield call(response.json.bind(response));
  yield put({ type: 'FETCHED', payload: json });
}

function takeChange() {
  return {
    addRed: take('ADD_RED'),
    removeRed: take('REMOVE_RED'),
    addBlue: take('ADD_BLUE'),
    removeBlue: take('REMOVE_BLUE'),
    shipped: take('SHIPPED')
  };
}

function buildItem(action, state) {
  switch (action.type) {
    case 'ADD_RED':
    case 'REMOVE_RED':
      return {
        type: 'red',
        count: state.redCount
      };
    case 'ADD_BLUE':
    case 'REMOVE_BLUE':
      return {
        type: 'blue',
        count: state.blueCount
      };
    default:
      return { type: 'unknown' };
  }
}

export function* watchChanges(getState) {
  let batch = {};
  let shippingSaga = null;

  while (true) {
    const results = yield race(takeChange());
    const key = keys(results)[0]; // will get the property name since only one prop can exist
    const action = results[key];

    if (action.type === 'SHIPPED') {
      batch = {};
      shippingSaga = null;
    } else {
      const state = getState();
      const item = buildItem(action, state);
      batch[item.type] = item;

      if (shippingSaga) {
        yield cancel(shippingSaga);
      }

      shippingSaga = yield fork(sendShipment, batch);
    }
  }
}
