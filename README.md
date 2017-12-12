## webpack-base-demo
- default configure use for window environment, if you want to use in OS, somethings maybe need to change.
---

### package.json

```
  "scripts": {
    "start": "NODE_ENV=dev webpack-dev-server --progress --colors",
    "mock": "node --harmony ./mock/server.js",
    "build": "rm -rf ./build && NODE_ENV=production webpack --config ./webpack.production.config.js --progress --colors"
  }

```

### server environment
- webpack.production.config.js
```
  new webpack.DefinePlugin({
    'process.env':{
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  })

```


