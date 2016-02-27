import { isUndefined, noop } from 'lodash';


export function onBeforeUnload(fn) {
  window.onbeforeunload = function handleEvent(__event) {
    fn();
    let event = __event;
    const message = 'Please wait a second while we sync your changes...';

    if (isUndefined(event)) {
      event = window.event;
    }

    if (event) {
      event.returnValue = message;
    }

    return message;
  };
}

export function removeBeforeUnload() {
  window.onbeforeunload = noop;
}

export function delay(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time));
}
