import React from 'react';

import Styles from '../screens/Styles';

import {
    Text,
    Icon,
    Layout
} from '@ui-kitten/components';

var sizeDef = 16

export default class TextMessage {
    static TextWarning = (value) => {
        return (
            <Layout style={Styles.padWarningCom}>
                <Icon name='alert-circle' width={sizeDef} height={sizeDef} fill='#ffaa00' />
                <Text status='warning'>{' ' + value}</Text>
            </Layout>
        )
    }
}