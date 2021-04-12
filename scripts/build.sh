#!/usr/bin/env bash
set -ex
docker run --rm -v $(pwd):/src emscripten/emsdk bash -c 'scripts/build_glpk.sh'