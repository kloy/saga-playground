import React from 'react';
import { Provider } from 'react-redux';
import BlueCounter from './BlueCounter';
import RedCounter from './RedCounter';
import More from './More';
import Notification from './Notification';
import DevTools from './DevTools';


export default function Root({ store }) {
  return (
    <Provider store={store}>
      <div>
        <Notification />
        <BlueCounter />
        <RedCounter />
        <More />
        <DevTools />
      </div>
    </Provider>
  );
}
