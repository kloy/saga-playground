import { last, isUndefined } from 'lodash';
import { update } from '../request';
import { SagaCancellationException } from 'redux-saga';
import { call, put } from 'redux-saga/effects';


function delay(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function calculateChangeset(queue) {
  const lastFolderUpdate = last(queue.filter(({ type }) => type === 'folder'));
  const lastTagUpdate = last(queue.filter(({ type }) => type === 'tag'));
  const params = {};

  if (!isUndefined(lastFolderUpdate)) {
    params.folderCount = lastFolderUpdate.count;
  }

  if (!isUndefined(lastTagUpdate)) {
    params.tagCount = lastTagUpdate.count;
  }


  return params;
}

export function* sendShipment(queue) {
  try {
    // delays
    yield call(delay, 5000);

    // request
    const params = calculateChangeset(queue);
    yield call(update, params);

    // complete
    yield put({
      type: 'SHIPPED',
      payload: {
        items: queue
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
