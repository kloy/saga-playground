import React from 'react';
import { connect } from 'react-redux';

const More = ({ sync }) => (
  <div>
    <br />
    <br />
    <button onClick={sync}>Sync</button>
  </div>
);

const actions = {
  sync: () => ({ type: 'FORCE_SYNC' })
};

export default connect(null, actions)(More);
