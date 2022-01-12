import React, { forwardRef, useState } from 'react';

import hoistNonReactStatics from 'hoist-non-react-statics';

import { Platform, View } from 'react-native';

import { Camera as OriginalCamera } from 'expo-camera';

import { useUpdate } from '@hashiprobr/react-use-mount-and-update';

import AndroidCamera from './AndroidCamera';

const Camera = forwardRef((props, ref) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [basis, setBasis] = useState(0);

    function onLayout({ nativeEvent }) {
        setWidth(nativeEvent.layout.width);
        setHeight(nativeEvent.layout.height);
    }

    useUpdate(() => {
        if (width > 0 && height > 0) {
            let large;
            let small;
            if (width < height) {
                large = height;
                small = width;
            } else {
                large = width;
                small = height;
            }
            setBasis((large - small) / 2);
        } else {
            setBasis(0);
        }
    }, [width, height]);

    const style = { ...props.style };

    const { children, ...childless } = props;

    childless.style = {
        flexGrow: 1,
    };

    childless.ref = ref;

    const paddingStyle = {
        flexBasis: basis,
        backgroundColor: props.cropColor || '#000000',
        opacity: props.cropAlpha || 0.5,
    };

    return (
        <View
            style={{
                ...props.viewStyle,
                flexGrow: style.flexGrow,
                alignSelf: style.alignSelf,
                flexDirection: 'column',
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
            {Platform.OS === 'android' ? (
                <AndroidCamera
                    {...childless}
                />
            ) : (
                <OriginalCamera
                    {...childless}
                />
            )}
            {props.crop && (
                <View
                    style={{
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <View
                        style={paddingStyle}
                    />
                    <View
                        style={paddingStyle}
                    />
                </View>
            )}
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

hoistNonReactStatics(Camera, OriginalCamera);

Camera.displayName = 'Camera';

export default Camera;
