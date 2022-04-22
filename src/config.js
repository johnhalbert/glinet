import { homedir } from 'os';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeFileSync,
} from 'fs';

export const configdir = `${homedir()}/.glinet`
export const configfile = `${configdir}/config`

if (!existsSync(configdir)) mkdirSync(configdir);
if (!existsSync(configfile)) closeSync(openSync(configfile, 'w'));

const config = JSON.parse(readFileSync(configfile).toString() || '{}');

export function getConfigValue(key) {
  return config[key];
}

export function setConfigValue(key, value) {
  config[key] = value;
}

process.on('exit', writeConfig)
function writeConfig() {
  writeFileSync(configfile, JSON.stringify(config, null, 2));
}
