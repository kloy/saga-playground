import React from 'react';
import { Provider } from 'react-redux';
import Counter from './Counter';
import DevTools from './DevTools';


export default function Root({ store }) {
  return (
    <Provider store={store}>
      <div>
        <Counter />
        <DevTools />
      </div>
    </Provider>
  );
}
