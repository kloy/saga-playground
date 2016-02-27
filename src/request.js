const host = 'localhost:3000';
// const host = 'mvcnbsztta.localtunnel.me';

export function read() {
  return fetch(`//${host}/boxcar`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export function update({ redCount, blueCount }) {
  const body = {};

  if (redCount !== null) {
    body.redCount = redCount;
  }

  if (blueCount !== null) {
    body.blueCount = blueCount;
  }

  return fetch(`//${host}/boxcar`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}
