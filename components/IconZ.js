import React, { Component } from 'react'
import { Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default ({ name, ...props }) => (
    <Ionicons
        name={Platform.OS === "ios" ? `ios-${name}` : `md-${name}`}
        {...props}
    />
);