import { connect } from 'react-redux';
import React from 'react';


const RedCounter = ({ add, count, remove }) => (
  <div>
    <h2>Red - {count}</h2>
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
  count: state.redCount
});

const actions = {
  add: () => ({ type: 'ADD_RED' }),
  remove: () => ({ type: 'REMOVE_RED' })
};

export default connect(selector, actions)(RedCounter);
