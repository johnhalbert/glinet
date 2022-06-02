import { call } from './fetch.js';
import api from './api.js';
import p from 'flat-await';

export default async function apiCommand(ip, name, method, payload, query) {
  const [err, response] = await call(ip, name, method, payload, query);
  if (err)
    return console.error(err);
  console.info(JSON.stringify(response, null, 2));
}
