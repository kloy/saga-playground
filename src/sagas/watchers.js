import { keys } from 'lodash';
import { sendShipment } from './boxcar';
import { take, call, put, race, fork, cancel } from 'redux-saga/effects';
import { read } from '../request';


export function* helloSaga() {
  console.log('Hello Sagas!');
}

export function* watchInit() {
  yield take('COUNTER_INIT');
  const response = yield call(read);
  const json = yield call(response.json.bind(response));
  yield put({ type: 'FETCHED', payload: json });
}

function takeBatch() {
  return {
    addTag: take('ADD_TAG'),
    removeTag: take('REMOVE_TAG'),
    addFolder: take('ADD_FOLDER'),
    removeFolder: take('REMOVE_FOLDER'),
    shipped: take('SHIPPED')
  };
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
      break;
    }

    if (shippingSaga !== null) {
      yield cancel(shippingSaga);
    }

    const state = getState();

    switch (key) {
      case 'addTag':
      case 'removeTag':
        queue.push({
          type: 'tag',
          count: state.tagCount
        });
        break;
      case 'addFolder':
      case 'removeFolder':
        queue.push({
          type: 'folder',
          count: state.folderCount
        });
        break;
      default:
        break;
    }

    shippingSaga = yield fork(sendShipment, queue);
  }
}
