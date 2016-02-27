function isGenerator(fn) {
  return typeof fn === 'function' && 'next' in fn.prototype && 'throw' in fn.prototype;
}

const createSagaDispatcher = sagaMiddleware => () => next => action => {
  if (isGenerator(action)) {
    return sagaMiddleware.run(action).done;
  }

  return next(action);
};

export default createSagaDispatcher;
