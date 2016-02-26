const initial = {
  folderCount: 0,
  tagCount: 0
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case 'ADD_TAG':
      return {
        ...state,
        tagCount: state.tagCount + 1
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        tagCount: state.tagCount - 1
      };
    case 'ADD_FOLDER':
      return {
        ...state,
        folderCount: state.folderCount + 1
      };
    case 'REMOVE_FOLDER':
      return {
        ...state,
        folderCount: state.folderCount - 1
      };
    case 'FETCHED':
      return {
        folderCount: action.payload.folderCount,
        tagCount: action.payload.tagCount
      };
    default:
      return state;
  }
}
