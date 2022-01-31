const core = require("@actions/core");

const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

const builder = core.getInput("builder");
const path = core.getInput("cache-path");

async function post() {
  try {
    core.info("Before pruning:");
    var {stdout, stderr} = await execAsync(`docker buildx du`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    var {stdout, stderr} = await execAsync(`docker buildx prune --force --filter type=regular`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    var {stdout, stderr} = await execAsync(`docker buildx prune --force --filter type=source.local`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    var {stdout, stderr} = await execAsync(`docker buildx prune --force --filter type=frontend`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    var {stdout, stderr} = await execAsync(`docker buildx prune --force --filter type=internal`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    var {stdout, stderr} = await execAsync(`docker buildx prune --force --filter type=exec.cachemount --keep-storage ${core.getInput('cache-max-size')}`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    core.info("After pruning:");

    var {stdout, stderr} = await execAsync(`docker buildx du`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    var {stdout, stderr} = await execAsync(`docker buildx du -v`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    var {stdout, stderr} = await execAsync(`docker run --rm \
      --volumes-from ${builder} \
      -v ${path}:/cache \
      alpine /bin/sh -c "cd / && tar cf /cache/buildkit-state.tar var/lib/buildkit"`);
    core.info(`stdout:\n${stdout}\n`);
    if (stderr) { core.error(`stderr:\n${stderr}\n`); }

    core.info("Cache archived successfully");
  } catch (error) {
    core.error(`Cache archive failed: ${error}`);
  }
}

post();
