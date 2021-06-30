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
  } catch (error) {
    core.error(`Cache restore failed: ${ error }`)
  }
}

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

// check if isPost is present in the action state
const isPost = !!core.getState('isPost')

if (!isPost) {
    run()
} else {
    post()
}
