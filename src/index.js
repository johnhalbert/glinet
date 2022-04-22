#!/usr/bin/env node

import login from './login.js';
import reboot from './reboot.js';
import p from 'flat-await';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getConfigValue, setConfigValue } from './config.js';

yargs(hideBin(process.argv))
  .command(
    'login <password>',
    'login to the router',
    (yargs) => {
      return yargs
        .positional('password', {
          describe: 'admin password for router',
        });
    },
    async ({ password, ip }) => {
      const [tokenErr, token] = await p(login(password, ip));
      if (tokenErr) return console.error(tokenErr.message);
      setConfigValue('token', token);
    }
  )
  .command(
    'reboot',
    'reboot the router',
    () => {},
    async ({ ip }) => {
      const token = getConfigValue('token');
      const [rebootErr] = await p(reboot(token, ip));
      if (rebootErr) console.error(rebootErr.message);
    }
  )
  .option('ip', {
    type: 'string',
    description: 'IP address of the router',
  })
  .demandCommand(1)
  .parse();
