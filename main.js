const core = require('@actions/core');

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const builder = core.getInput('builder');
const path = core.getInput('cache-path');

async function run() {
  try {
    await execAsync('docker buildx stop');

    await execAsync(`docker run --rm \
      --volumes-from ${ builder } \
      -v ${ path }:/cache \
      alpine /bin/sh -c "cd / && tar xf /cache/buildkit-state.tar"`);

    core.info('Cache restored successfully');

    var {stdout, stderr} = await execAsync(`docker exec ${builder} buildctl du -v`);
    core.info(`Cache now contains:\n${stdout}\n`);
  } catch (error) {
    core.error(`Cache restore failed: ${ error }`);
  }
}

run()
