import { connect } from 'react-redux';
import React from 'react';


const BlueCounter = ({ add, count, remove }) => (
  <div>
    <h2>Blue - {count}</h2>
    <button onClick={add}>
      Add
    </button>
    {' '}
    <button onClick={remove}>
      Remove
    </button>
  </div>
);

const selector = state => ({
  count: state.blueCount
});

const actions = {
  add: () => ({ type: 'ADD_BLUE' }),
  remove: () => ({ type: 'REMOVE_BLUE' })
};

export default connect(selector, actions)(BlueCounter);
