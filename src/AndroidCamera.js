import React, { forwardRef, useRef, useState } from 'react';

import { View } from 'react-native';

import { Camera } from 'expo-camera';

import { useUpdate } from '@hashiprobr/react-use-mount-and-update';

import Padding from './Padding';

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
        if (props.onLayout) {
            props.onLayout();
        }
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

    const style = { ...props.style };

    const { children, ...childless } = props;

    return (
        <View
            style={{
                ...props.viewStyle,
                flexGrow: style.flexGrow,
                alignSelf: style.alignSelf,
                flexDirection: width < height ? 'column' : 'row',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                margin: style.margin,
                marginTop: style.marginTop,
                marginRight: style.marginRight,
                marginBottom: style.marginBottom,
                marginLeft: style.marginLeft,
                padding: 0,
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                overflow: 'visible',
            }}
            onLayout={onLayout}
        >
            <Padding
                basis={basis}
                color={props.color}
            />
            <Camera
                {...childless}
                ref={ref}
                style={{
                    flexGrow: 1,
                }}
                ratio={ratio}
                onCameraReady={onCameraReady}
            />
            <Padding
                basis={basis}
                color={props.color}
            />
            <View
                style={{
                    ...style,
                    flexGrow: 1,
                    alignSelf: 'stretch',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    margin: 0,
                    marginTop: 0,
                    marginRight: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                }}
            >
                {children}
            </View>
        </View>
    );
});

AndroidCamera.displayName = 'AndroidCamera';

export default AndroidCamera;
