import React from 'react';

import hoistNonReactStatics from 'hoist-non-react-statics';

import { Camera as OriginalCamera } from 'expo-camera';

function Camera(props) {
    return (
        <OriginalCamera
            {...props}
        />
    );
}

hoistNonReactStatics(Camera, OriginalCamera);

export default Camera;
