import React, { Component } from 'react'
import * as IK from '../components/IconKitten';

import { GlobalContext } from '../components/GlobalContext';
import Session from '../components/Session';
import Styles from './Styles';

import {
  Layout,
  Avatar,
  Text,
  Button
} from '@ui-kitten/components'

export default class SettingsScreen extends Component {
  static contextType = GlobalContext; // Nhận biến global

  constructor(props) {
    super(props);
    
    this.state = {
      expoToken: '',
      userID: null
    };
  }

  render() {
    return (
      <Layout style={Styles.flexFull}>
        <Layout style={{ minHeight: 200 }}>
          <Layout style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Avatar size='large' source={require('../assets/person.png')} />
          </Layout>
          <Layout style={{ marginTop: 20 }}>
            <Text style={{ textAlign: 'center' }} category='h5' status='basic'>{this.state.userID}</Text>
          </Layout>
          <Layout style={{ marginTop: 20 }}>
            <Button appearance='outline' status='primary' icon={IK.Login} onPress={() => { this.dangXuat() }}>
              Đăng xuất
              </Button>
          </Layout>
        </Layout>
      </Layout>
    )
  }

  componentDidMount() {
    Session.getUserInfo().then((goals) => {
      this.setState({
        userID: goals.TenHienThi
      })
    })
  }

  dangXuat() {
    Session.removeUserInfo().then((res) => {
      this.context.setProfile(null); // Điều hướng sang trang Home
    });
  }
}