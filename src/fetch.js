import p from 'flat-await';
import nodeFetch from 'node-fetch';
import login from './login.js';
import { getConfigValue } from './config.js';
import api from './api.js';
import querystring from 'querystring';

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
          const [loginErr, token] = await login(password, ip);
          if (loginErr)
            return [new Error('Unable to login'), null];
          options.headers.authorization = token;
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

export async function call(ip, endpoint, method, payload, query) {
  return fetch(
    `http://${ip}/${api[endpoint]}${query ? `?${querystring.encode(query)}` : ''}`,
    {
      'headers': {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': '6f4680623b7a46f3b2d56634bdb7c91c',
        'sec-gpc': '1',
        'x-requested-with': 'XMLHttpRequest'
      },
      'referrer': `http://${ip}/`,
      'origin': ip,
      'host': `http://${ip}`,
      'referrerPolicy': 'strict-origin-when-cross-origin',
      'body': payload,
      'method': method,
      'mode': 'cors',
      'credentials': 'include'
    }
  );
}
