#!/usr/bin/env node

import login from './login.js';
import reboot from './reboot.js';
import p from 'flat-await';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getConfigValue, setConfigValue } from './config.js';
import apiCommand from './apiCommand.js';

yargs(hideBin(process.argv))
  .command(
    'wan',
    'WAN related commands',
    (yargs) => {
      return yargs
        .command(
          'info',
          'WAN info',
          () => {},
          ({ ip } ) => apiCommand(ip, 'waninfo', 'GET'),
        )
        /*
        .command(
          'access',
          'WAN access',
          (yargs) => {
            return yargs
              .command(
                'get',
                'Get WAN access settings',
                () => {},
                () => console.log('bim')
              )
              .command(
                'set',
                'Set WAN access settings',
                () => {},
                () => console.log('barry')
              )
              .demandCommand();
          },
          () => console.log('baz')
        )
        */
        .demandCommand();
    },
  )
  .command(
    'modem',
    'Modem related commands',
    (yargs) => {
      return yargs
        .command(
          'info',
          'Retrieve info about the modem',
          () => {},
          ({ ip }) => apiCommand(ip, 'moInfo', 'GET'),
        )
        .demandCommand();
    },
  )
  .command(
    'repeater',
    'Repeater related commands',
    (yargs) => {
      return yargs
        .command(
          'info',
          'Retrieve info about repeater status',
          () => {},
          ({ ip }) => apiCommand(ip, 'stainfo', 'GET'),
        )
        .demandCommand();
    },
  )
  .command(
    'tethering',
    'Tethering related commands',
    (yargs) => {
      return yargs
        .command(
          'info',
          'Retrieve info about tethering status',
          () => {},
          ({ ip }) => apiCommand(ip, 'teinfo', 'GET'),
        )
        .demandCommand();
    },
  )
  .command(
    'shell',
    'Connect via SSH',
    () => {},
    () => {},
  )
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
      if (loginErr)
        return console.error(loginErr.message);
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
    default: '192.168.8.1',
  })
  .demandCommand(1)
  .parse();
