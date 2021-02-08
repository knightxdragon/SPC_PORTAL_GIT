import React, { Component } from 'react'
import { Layout, Spinner } from '@ui-kitten/components';
import Styles from '../screens/Styles';

export default class MyActivityIndicator extends Component {
    render() {
        return (
            <Layout style={{justifyContent: "center", alignItems: "center", padding: 5}}>
                <Spinner />
            </Layout>
        )
    }
}