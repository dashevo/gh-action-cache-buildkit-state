const core = require("@actions/core");

const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

const builder = core.getInput("builder");
const path = core.getInput("cache-path");

async function post() {
  try {
    core.info("Before pruning:");
    await execAsync(
      `docker exec ${builder} buildctl du`,
      {},
      function (error, stdout, stderr) {
        if (error) {
          core.error(`exec error: ${error}`);
          return;
        }
        core.info(`stdout: ${stdout}`);
        core.error(`stderr: ${stderr}`);
      }
    );
    await execAsync(
      `docker exec ${builder} buildctl du -v`,
      {},
      function (error, stdout, stderr) {
        if (error) {
          core.error(`exec error: ${error}`);
          return;
        }
        core.info(`stdout: ${stdout}`);
        core.error(`stderr: ${stderr}`);
      }
    );
    await execAsync(
      `docker buildx prune --force --keep-storage ${core.getInput("cache-max-size")}`,
      {},
      function (error, stdout, stderr) {
        if (error) {
          core.error(`exec error: ${error}`);
          return;
        }
        core.info(`stdout: ${stdout}`);
        core.error(`stderr: ${stderr}`);
      }
    );
    core.info("After pruning:");
    await execAsync(
      `docker exec ${builder} buildctl du`,
      {},
      function (error, stdout, stderr) {
        if (error) {
          core.error(`exec error: ${error}`);
          return;
        }
        core.info(`stdout: ${stdout}`);
        core.error(`stderr: ${stderr}`);
      }
    );
    await execAsync(
      `docker exec ${builder} buildctl du -v`,
      {},
      function (error, stdout, stderr) {
        if (error) {
          core.error(`exec error: ${error}`);
          return;
        }
        core.info(`stdout: ${stdout}`);
        core.error(`stderr: ${stderr}`);
      }
    );
    await execAsync(
      `docker run --rm \
        --volumes-from ${builder} \
        -v ${path}:/cache \
        alpine /bin/sh -c "cd / && tar cf /cache/buildkit-state.tar /var/lib/buildkit"`,
      {},
      function (error, stdout, stderr) {
        if (error) {
          core.error(`exec error: ${error}`);
          return;
        }
        core.info(`stdout: ${stdout}`);
        core.error(`stderr: ${stderr}`);
      }
    );
    core.info("Cache archived successfully");
  } catch (error) {
    core.error(`Cache archive failed: ${error}`);
  }
}

post();
