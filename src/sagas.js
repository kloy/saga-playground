import { partial, pick, values } from 'lodash';
import { SagaCancellationException } from 'redux-saga';
import { call, cancel, fork, put, take, race } from 'redux-saga/effects';
import { delay, onBeforeUnload, removeBeforeUnload } from './utils';
import { read, update } from './request';


const DELAY = 10000; // 10 seconds

function buildParams(batch) {
  const params = {};

  if (batch.hasOwnProperty('blue')) {
    params.blueCount = batch.blue;
  }

  if (batch.hasOwnProperty('red')) {
    params.redCount = batch.red;
  }

  return params;
}

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

export function* loadData() {
  const response = yield call(read);
  const json = yield call(response.json.bind(response));
  yield put({ type: 'FETCHED', payload: json });
}

export function* sendShipment(batch) {
  try {
    const params = buildParams(batch);

    // delays
    onBeforeUnload(partial(update, params));
    yield race({
      delay: call(delay, DELAY),
      forceSync: take('FORCE_SYNC')
    });

    // request
    const response = yield call(update, params);
    removeBeforeUnload();

    // complete
    if (response.status === 200) {
      yield put({
        type: 'SHIPPED',
        payload: {
          batch
        }
      });
    } else {
      yield put({ type: 'FAILED' });
    }
  } catch (error) {
    if (error instanceof SagaCancellationException) {
      removeBeforeUnload();
    } else {
      throw error;
    }
  }
}

export function* watchForShipped(getState) {
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

export function* watchForShippingRequests() {
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

export function* watchForChanges(getState) {
  while (true) {
    const results = yield race(takeChange());

    const action = values(results)[0]; // get the first result since only one prop can exist
    const state = getState();
    const payload = buildItem(action, state);
    yield put({ type: 'SHIPPING_REQUEST', payload });
  }
}

export default function* root(getState) {
  yield [
    fork(watchForChanges, getState),
    fork(watchForShippingRequests),
    fork(watchForShipped, getState)
  ];
}
