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

export function update({ tagCount, folderCount }) {
  const body = {};

  if (tagCount !== null) {
    body.tagCount = tagCount;
  }

  if (folderCount !== null) {
    body.folderCount = folderCount;
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
