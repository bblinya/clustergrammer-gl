
BUILD_DIR=build
ROOT=$(pwd)

if [[ ! -d ${BUILD_DIR} ]]; then
  mkdir ${BUILD_DIR}
  cd ${BUILD_DIR} && ln -sf ../data .
fi

cd ${ROOT}
NODE_OPTIONS=--openssl-legacy-provider npx webpack

