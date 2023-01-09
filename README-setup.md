
# README for wlt-updated project.

## Installation

``` bash
npm install
```

## Run

This cluster-grammergl project needs two-step including compilation and service serving.

1. Compile source javascript into bundled target with webpack.

``` bash
npm start
# or run with raw webpack command as follows:
NODE_OPTIONS=--openssl-legacy-provider npx webpack
```

The above command will generate the target js file in build directory.

2. Serving the project root as static website

``` bash
# use python embeded module as static server
python3 -m http.server
# or other methods to serve this directory, including nginx, apache, node, ...etc.
```

Now you can access the cluseter-grammergl website with the port you served it,
8000 is the default port for python http.server if not specified.

