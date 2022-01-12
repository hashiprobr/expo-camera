import React, { forwardRef, useRef, useState } from 'react';

import { View } from 'react-native';

import { Camera } from 'expo-camera';

import { useUpdate } from '@hashiprobr/react-use-mount-and-update';

const AndroidCamera = forwardRef((props, ref) => {
    if (!ref) {
        ref = useRef();
    }

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [ratios, setRatios] = useState([[4, 3]]);
    const [ratio, setRatio] = useState('4:3');
    const [basis, setBasis] = useState(0);

    function onLayout({ nativeEvent }) {
        setWidth(nativeEvent.layout.width);
        setHeight(nativeEvent.layout.height);
    }

    function onCameraReady() {
        onCameraReadyAsync();
        if (props.onCameraReady) {
            props.onCameraReady();
        }
    }

    async function onCameraReadyAsync() {
        if (ref.current) {
            const ratioStrings = await ref.current.getSupportedRatiosAsync();
            const ratioArrays = [];
            for (const ratioString of ratioStrings) {
                const [large, small] = ratioString.split(':');
                ratioArrays.push([parseInt(large), parseInt(small)]);
            }
            setRatios(ratioArrays);
        }
    }

    useUpdate(() => {
        if (width > 0 && height > 0) {
            let outerRatio;
            let outerLarge;
            let outerSmall;
            if (width < height) {
                outerRatio = height / width;
                outerLarge = height;
                outerSmall = width;
            } else {
                outerRatio = width / height;
                outerLarge = width;
                outerSmall = height;
            }
            let bestDistance = Number.POSITIVE_INFINITY;
            let bestArray;
            let bestRatio;
            for (const array of ratios) {
                const innerRatio = array[0] / array[1];
                const distance = outerRatio - innerRatio;
                if (distance >= 0 && distance < bestDistance) {
                    bestDistance = distance;
                    bestArray = array;
                    bestRatio = innerRatio;
                }
            }
            setRatio(`${bestArray[0]}:${bestArray[1]}`);
            setBasis((outerLarge - outerSmall * bestRatio) / 2);
        } else {
            setRatio('4:3');
            setBasis(0);
        }
    }, [width, height, ratios]);

    const paddingStyle = {
        flexBasis: basis,
        backgroundColor: props.padColor || '#000000',
    };

    return (
        <View
            style={{
                flexGrow: 1,
                flexDirection: width < height ? 'column' : 'row',
            }}
            onLayout={onLayout}
        >
            <View
                style={paddingStyle}
            />
            <Camera
                {...props}
                ref={ref}
                ratio={ratio}
                onCameraReady={onCameraReady}
            />
            <View
                style={paddingStyle}
            />
        </View>
    );
});

AndroidCamera.displayName = 'AndroidCamera';

export default AndroidCamera;
