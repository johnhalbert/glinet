import p from 'flat-await';
import nodeFetch from 'node-fetch';

export default async function fetch(url, options) {
  const [responseErr, response] = await p(nodeFetch(url, options));
  if (responseErr) throw responseErr;

  const [bodyErr, body] = await p(response.json());
  if (bodyErr) throw bodyErr;

  if (!~body.code) {
    switch (body.msg) {
      case 'Token error': {
        return [new Error('Not logged in, or login expired'), null];
      }
      default: {
        return [new Error(body.msg), null];
      }
    }
  }

  return [null, body];
}
