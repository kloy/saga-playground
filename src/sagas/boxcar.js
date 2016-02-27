import { noop, isUndefined, partial } from 'lodash';
import { update } from '../request';
import { SagaCancellationException } from 'redux-saga';
import { call, put, take, race } from 'redux-saga/effects';


const DELAY = 10000; // 10 seconds

function onBeforeUnload(fn) {
  window.onbeforeunload = function handleEvent(__event) {
    fn();
    let event = __event;
    const message = 'Please wait a second while we sync your changes...';

    if (isUndefined(event)) {
      event = window.event;
    }

    if (event) {
      event.returnValue = message;
    }

    return message;
  };
}

function removeBeforeUnload() {
  window.onbeforeunload = noop;
}

function delay(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time));
}

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
