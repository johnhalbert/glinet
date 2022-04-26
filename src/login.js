import p from 'flat-await';
import fetch from './fetch.js';
import nodeFetch from 'node-fetch';
import { getConfigValue, setConfigValue } from './config.js';

export default async function login(password=getConfigValue('password'), ip='192.168.8.1', savePassword=false) {
  if (savePassword && password)
    setConfigValue('password', password);

  const [responseErr, response] = await p(nodeFetch(`http://${ip}/cgi-bin/api/router/login`, {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "authorization": "undefined",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-gpc": "1",
      "x-requested-with": "XMLHttpRequest"
    },
    "origin": ip,
    "host": `http://${ip}`,
    "referrer": `http://${ip}/`,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `pwd=${password}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }));

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

  setConfigValue('token', body.token);
  return [null, body.token];
}
