function* player(name, table) {
  while (true) { // eslint-disable-line no-constant-condition
    const ball = yield csp.take(table);

    if (ball === csp.CLOSED) {
      console.log(name + ": table's gone"); // eslint-disable-line no-console
      return;
    }

    ball.hits += 1;
    console.log(name + ' ' + ball.hits); // eslint-disable-line no-console
    yield csp.timeout(100);
    yield csp.put(table, ball);
  }
}

csp.go(function* example() {
  const table = csp.chan();

  csp.go(player, ['ping', table]);
  csp.go(player, ['pong', table]);

  yield csp.put(table, { hits: 0 });
  yield csp.timeout(1000);
  table.close();
});

function listenToClose(ch) {
  window.addEventListener('beforeunload', () => csp.putAsync({ type: 'WINDOW_CLOSE' }));
}

const debounced = debounce((ch) => csp.putAsync(ch, { type: 'DEBOUNCED' }), 5000);

function* onViewerClose(reduxCh, boxcarCh) {
  let action;

  while ((action = yield csp.take(reduxCh)) !== csp.CLOSED) { // eslint-disable-line no-cond-assign
    if (action.type !== 'VIEWER_CLOSE') {
      break;
    }

    yield csp.put(boxcarCh, { type: 'VIEWER_CLOSE' });
  }
}

function* boxcar(reduxCh) {
  const boxcarCh = csp.channel();

  csp.go(onViewerClose(reduxCh, boxcarCh));
}

function beforeWindowClose(fn) {
  window.onbeforeunload = evt => {
    fn(null);
    // asPromise('onbeforeunload');
    const message = 'Please wait a second while we sync your changes...';

    if (typeof evt === 'undefined') {
        evt = window.event;
    }

    if (evt) {
        evt.returnValue = message;
    }

    return message;
  };
}
