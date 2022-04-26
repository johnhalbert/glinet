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
        })
        .option('save-password', {
          type: 'boolean',
          description: 'Save password to enable auto-login',
        });
    },
    async ({ password, ip, savePassword }) => {
      const [loginErr] = await p(login(password, ip, savePassword));
      if (loginErr) return console.error(loginErr.message);
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
