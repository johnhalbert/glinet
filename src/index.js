#!/usr/bin/env node

import login from './login.js';
import reboot from './reboot.js';
import p from 'flat-await';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getConfigValue, setConfigValue } from './config.js';

yargs(hideBin(process.argv))
  .command(
    'login <password> [ip]',
    'login to the router',
    (yargs) => {
      return yargs
        .positional('password', {
          describe: 'admin password for router',
        })
        .positional('ip', {
          describe: 'ip of the router',
          default: '192.168.8.1',
        });
    },
    async ({ password, ip }) => {
      const [tokenErr, token] = await p(login(password, ip));
      if (tokenErr) return console.error(tokenErr.message);
      setConfigValue('token', token);
    }
  )
  .command(
    'reboot [ip]',
    'reboot the router',
    (yargs) => {
      return yargs
        .positional('ip', {
          describe: 'ip of the router',
          default: '192.168.8.1',
        });
    },
    async ({ ip }) => {
      const token = getConfigValue('token');
      const [rebootErr] = await p(reboot(token, ip));
      if (rebootErr) console.error(rebootErr.message);
    }
  )
  .demandCommand(1)
  .parse();
