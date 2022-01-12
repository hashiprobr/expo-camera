import React from 'react';

import { View } from 'react-native';

export default function Padding(props) {
    return (
        <View
            style={{
                flexBasis: props.basis,
                backgroundColor: props.color || '#000000',
            }}
        />
    );
}
