import p from 'flat-await';
import nodeFetch from 'node-fetch';
import login from './login.js';
import { getConfigValue } from './config.js';

export default async function fetch(url, options) {
  const [responseErr, response] = await p(nodeFetch(url, options));
  if (responseErr) throw responseErr;

  const [bodyErr, body] = await p(response.json());
  if (bodyErr) throw bodyErr;

  if (!~body.code) {
    switch (body.msg) {
      case 'Token error': {
        const password = getConfigValue('password');
        if (password) {
          const { host: ip } = new URL(url);
          const [loginErr] = login(password, ip);
          if (loginErr)
            return [new Error('Unable to login'), null];
          return fetch(url, options);
        }
        return [new Error('Not logged in, or login expired'), null];
      }
      default: {
        return [new Error(body.msg), null];
      }
    }
  }

  return [null, body];
}
