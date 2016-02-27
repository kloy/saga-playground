const initial = {
  blueCount: 0,
  redCount: 0
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case 'ADD_RED':
      return {
        ...state,
        redCount: state.redCount + 1
      };
    case 'REMOVE_RED':
      return {
        ...state,
        redCount: state.redCount - 1
      };
    case 'ADD_BLUE':
      return {
        ...state,
        blueCount: state.blueCount + 1
      };
    case 'REMOVE_BLUE':
      return {
        ...state,
        blueCount: state.blueCount - 1
      };
    case 'FETCHED':
      return {
        blueCount: action.payload.blueCount,
        redCount: action.payload.redCount
      };
    default:
      return state;
  }
}
