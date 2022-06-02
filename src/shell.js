import { NodeSSH } from 'node-ssh';

module.exports = async function shell() {
  const ssh = new NodeSSH()
  await ssh.connect({
      host: 'yourhost',
      username: 'yourusername',
      agent: process.env.SSH_AUTH_SOCK,
      compress: true,
  })

  const pipeStream = stream => {
    const {stdin, stdout, stderr} = process;
    const {isTTY} = stdout;

    if (isTTY && stdin.setRawMode)
      stdin.setRawMode(true);

    stream.pipe(stdout);
    stream.stderr.pipe(stderr);
    stdin.pipe(stream);

    if (isTTY) {
        stream.once('data', onResize);
        process.stdout.on('resize', onResize);
    }

    stream.on('close', () => {
        if (isTTY) process.stdout.removeListener('resize', onResize)
        stream.unpipe();
        stream.stderr.unpipe();
        stdin.unpipe();
        if (stdin.setRawMode)
          stdin.setRawMode(false);
        stdin.unref();
    });
  };

  await new Promise((resolve, reject) => {
    ssh.connection.shell({term: process.env.TERM || 'vt100'}, (err, stream) => {
      if (err) {
        reject(err);
        return;
      }
      pipeStream(stream);
      stream.on('close', () => resolve(true));
    });
  });

  ssh.dispose();
}
