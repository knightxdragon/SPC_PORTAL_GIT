import React from 'react';
import Colors from '../constants/Colors';
import IconZ from './IconZ';

export default function TabBarIcon(props) {
  return (
    <IconZ
      name={props.name}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
