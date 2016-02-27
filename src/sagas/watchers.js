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

function takeBatch() {
  return {
    addRed: take('ADD_RED'),
    removeRed: take('REMOVE_RED'),
    addBlue: take('ADD_BLUE'),
    removeBlue: take('REMOVE_BLUE'),
    shipped: take('SHIPPED')
  };
}

function makeQueueItem(type, state) {
  switch (type) {
    case 'addRed':
    case 'removeRed':
      return {
        type: 'red',
        count: state.redCount
      };
    case 'addBlue':
    case 'removeBlue':
      return {
        type: 'blue',
        count: state.blueCount
      };
    default:
      return { type: 'unknown' };
  }
}

export function* watchChanges(getState) {
  let queue = [];
  let shippingSaga = null;

  while (true) {
    const results = yield race(takeBatch());
    const key = keys(results)[0]; // will get the property name since only one prop can exist

    if (key === 'shipped') {
      queue = [];
      shippingSaga = null;
    } else {
      const state = getState();
      const item = makeQueueItem(key, state);
      queue.push(item);

      if (shippingSaga) {
        yield cancel(shippingSaga);
      }

      shippingSaga = yield fork(sendShipment, queue);
    }
  }
}
