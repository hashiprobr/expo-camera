import React from 'react';

import hoistNonReactStatics from 'hoist-non-react-statics';

import { Platform } from 'react-native';

import { Camera as OriginalCamera } from 'expo-camera';

import AndroidCamera from 'AndroidCamera';

function Camera(props) {
    return Platform.OS === 'android' ? (
        <AndroidCamera
            {...props}
        />
    ) : (
        <OriginalCamera
            {...props}
        />
    );
}

hoistNonReactStatics(Camera, OriginalCamera);

export default Camera;
