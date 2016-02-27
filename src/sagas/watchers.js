import { values, pick } from 'lodash';
import { sendShipment } from './boxcar';
import { take, call, put, race, fork, cancel } from 'redux-saga/effects';
import { read } from '../request';


function buildItem(action, state) {
  switch (action.type) {
    case 'ADD_RED':
    case 'REMOVE_RED':
      return {
        type: 'red',
        shipment: state.redCount
      };
    case 'ADD_BLUE':
    case 'REMOVE_BLUE':
      return {
        type: 'blue',
        shipment: state.blueCount
      };
    default:
      return { type: 'unknown', shipment: null };
  }
}

function takeChange() {
  return {
    addRed: take('ADD_RED'),
    removeRed: take('REMOVE_RED'),
    addBlue: take('ADD_BLUE'),
    removeBlue: take('REMOVE_BLUE')
  };
}

export function* helloSaga() {
  console.log('Hello Sagas!');
}

export function* watchInit() {
  yield take('APP_INITIALIZED');
  const response = yield call(read);
  const json = yield call(response.json.bind(response));
  yield put({ type: 'FETCHED', payload: json });
}

export function* watchShipped(getState) {
  let previousState = getState();
  while (true) {
    const { shipped, failed, fetched } = yield race({
      shipped: take('SHIPPED'),
      failed: take('FAILED'),
      fetched: take('FETCHED')
    });

    if (shipped || fetched) {
      previousState = getState();
    }

    if (failed) {
      yield put({
        type: 'NOTIFY_FAILURE',
        payload: pick(previousState, ['redCount', 'blueCount'])
      });
    }
  }
}

export function* watchShippingRequests() {
  let shippingSaga = null;
  let batch = {};

  while (true) {
    const { request, shipped } = yield race({
      request: take('SHIPPING_REQUEST'),
      shipped: take('SHIPPED')
    });

    if (shipped) {
      batch = {};
      shippingSaga = null;
    } else {
      const { type, shipment } = request.payload;
      batch[type] = shipment;

      if (shippingSaga !== null) {
        yield cancel(shippingSaga);
      }

      shippingSaga = yield fork(sendShipment, batch);
    }
  }
}

export function* watchChanges(getState) {
  while (true) {
    const results = yield race(takeChange());

    const action = values(results)[0]; // get the first result since only one prop can exist
    const state = getState();
    const payload = buildItem(action, state);
    yield put({ type: 'SHIPPING_REQUEST', payload });
  }
}
