expo-camera
===========

**A modified version of
[expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) with automatic
ratio in Android and additional configurability**


Peer dependencies
-----------------

``` json
{
    "@hashiprobr/react-use-mount-and-update": "^1.0.4",
    "expo": "^43.0.5",
    "expo-camera": "^12.0.3",
    "hoist-non-react-statics": "^3.3.2",
    "react": "^17.0.1",
    "react-native": ">=0.64.3"
}
```


Install
-------

With npm:

```
npm install @hashiprobr/expo-camera
```

With yarn:

```
yarn add @hashiprobr/expo-camera
```

With expo:

```
expo install @hashiprobr/expo-camera
```

If using Expo, add the module to `webpack.config.js`:

``` js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync({
        ...env,
        babel: {
            dangerouslyAddModulePathsToTranspile: [
                '@hashiprobr/expo-camera',
            ],
        },
    }, argv);
    return config;
};
```

If `webpack.config.js` does not exist, create it with:

```
expo customize:web
```


Removed props
-------------

| name         | description                                               |
|--------------|-----------------------------------------------------------|
| ratio        | automatically chosen as the closer to the component ratio |


Added props
-----------

| name      | description                                                               |
|-----------|---------------------------------------------------------------------------|
| padColor  | color of the padding when the ratio and the component ratio are different |
| crop      | if true, the preview is cropped to a square area                          |
| cropColor | color of the crop                                                         |
| cropAlpha | opacity of the crop                                                       |
