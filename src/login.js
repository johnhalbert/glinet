import p from 'flat-await';
import fetch from './fetch.js';

export default async function login(password, ip='192.168.8.1') {
  const [responseErr, response] = await fetch(`http://${ip}/cgi-bin/api/router/login`, {
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
  });

  return response.token;
}
