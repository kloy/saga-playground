import React from 'react';
import { connect } from 'react-redux';


const styles = show => ({
  background: 'red',
  color: '#000',
  display: show ? 'block' : 'none',
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer'
});

const Notification = ({ close, show }) => (
  <p onClick={close} style={styles(show)}>
    Failed to save changes, please try again.
    <a style={{ color: '#FFF' }}> X</a>
  </p>
);


const selector = ({ showNotification }) => ({ show: showNotification });
const actions = {
  close: () => ({ type: 'HIDE_NOTIFICATION' })
};

export default connect(selector, actions)(Notification);
