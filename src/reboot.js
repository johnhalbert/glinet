import fetch from './fetch.js';

export default async function reboot(token, ip='192.168.8.1') {
    const [responseErr, response] = await fetch(`http://${ip}/cgi-bin/api/router/reboot`, {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "authorization": token,
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-gpc": "1",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": `http://${ip}/`,
      "origin": ip,
      "host": `http://${ip}`,
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "reboot=true",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });

  if (responseErr) throw responseErr;
  console.info('Rebooting...');
}
