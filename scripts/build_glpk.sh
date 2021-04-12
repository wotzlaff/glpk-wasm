#!/usr/bin/env bash
set -ex

GLPK_VERSION=5.0
glpk=glpk-${GLPK_VERSION}

pushd /tmp
wget https://ftp.gnu.org/gnu/glpk/${glpk}.tar.gz -O glpk.tar.gz
tar -xf glpk.tar.gz

pushd ${glpk}
emconfigure ./configure
emmake make -j4
glpk_dir=$(pwd)
popd

popd

GLPK_DIR=${glpk_dir} make