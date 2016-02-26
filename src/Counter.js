import { connect } from 'react-redux';
import React from 'react';


const Counter = ({
  addTag,
  removeTag,
  addFolder,
  removeFolder,
  tagCount,
  folderCount
}) => (
  <div>
    <h2>Tags</h2>
    <button onClick={addTag}>
      Add
    </button>
    {' '}
    <button onClick={removeTag}>
      Remove
    </button>
    <h2>Folders</h2>
    <button onClick={addFolder}>
      Add
    </button>
    {' '}
    <button onClick={removeFolder}>
      Remove
    </button>
    <hr />
    <p><b>Tags:</b> {tagCount}</p>
    <p><b>Folders:</b> {folderCount}</p>
  </div>
);

const selector = state => ({
  tagCount: state.tagCount,
  folderCount: state.folderCount
});

const actions = {
  addTag: () => ({ type: 'ADD_TAG' }),
  removeTag: () => ({ type: 'REMOVE_TAG' }),
  addFolder: () => ({ type: 'ADD_FOLDER' }),
  removeFolder: () => ({ type: 'REMOVE_FOLDER' })
};

export default connect(selector, actions)(Counter);
