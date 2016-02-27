import React from 'react';
import { Provider } from 'react-redux';
import BlueCounter from './BlueCounter';
import RedCounter from './RedCounter';
import DevTools from './DevTools';


export default function Root({ store }) {
  return (
    <Provider store={store}>
      <div>
        <BlueCounter />
        <RedCounter />
        <DevTools />
      </div>
    </Provider>
  );
}
