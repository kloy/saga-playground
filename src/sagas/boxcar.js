import { update } from '../request';
import { SagaCancellationException } from 'redux-saga';
import { call, put } from 'redux-saga/effects';


function delay(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function buildParams(batch) {
  const params = {};

  if (batch.hasOwnProperty('blue')) {
    params.blueCount = batch.blue.count;
  }

  if (batch.hasOwnProperty('red')) {
    params.redCount = batch.red.count;
  }

  return params;
}

export function* sendShipment(batch) {
  try {
    // delays
    yield call(delay, 1000);

    // request
    const params = buildParams(batch);
    yield call(update, params);

    // complete
    yield put({
      type: 'SHIPPED',
      payload: {
        batch
      }
    });
  } catch (error) {
    if (error instanceof SagaCancellationException) {
      console.log('cancelled');
    } else {
      throw error;
    }
  }
}
