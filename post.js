const core = require('@actions/core');

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const builder = core.getInput('builder');
const path = core.getInput('cache-path');

async function post() {
  try {
    await execAsync(`docker buildx prune --force --keep-storage ${ core.getInput('cache-max-size')}`)

    await execAsync(`docker run --rm \
      --volumes-from ${ builder } \
      -v ${ path }:/cache \
      alpine /bin/sh -c "cd / && tar cf /cache/buildkit-state.tar /var/lib/buildkit"`);

    core.info('Cache archived successfully');
  } catch (error) {
    core.error(`Cache archive failed: ${ error }`);
  }
}

post()
