# gh-action-cache-buildkit-state

## Usage

```yml
- name: Set up Docker BuildX
  id: buildx
  uses: docker/setup-buildx-action@v1
  with:
    install: true
    driver-opts: image=moby/buildkit:buildx-stable-1

- name: Enable buildkit cache
  uses: actions/cache@v2
  with:
    path: /tmp/buildkit-cache/buildkit-state.tar
    key: ${{ runner.os }}-buildkit-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildkit-

- name: Load buildkit state from cache
  uses: dashevo/gh-action-cache-buildkit-state@v1
  with:
    builder: buildx_buildkit_${{ steps.buildx.outputs.name }}0
    cache-path: /tmp/buildkit-cache
    cache-max-size: 2g
```
