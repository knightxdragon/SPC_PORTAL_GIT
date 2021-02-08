import React, { Component } from 'react';
import { StyleSheet, Font } from 'react-native';
import {
    Container,
    Header,
    Content,
    Button,
    Text,
    View
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import IconZ from '../components/IconZ';
import { Notifications, Constants } from 'expo';
import * as Permissions from 'expo-permissions';
import Config from '../class/Config';
import Session from '../components/Session';
import Styles from '../screens/Styles';
import Colors from '../constants/Colors';

const sizeIcon = 40

export default class TestNotifi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notification: null, // cờ trạng thái thông báo
            badgeCount: 0
        };
    }

    render() {
        return (
            <View style={{ width: 24, height: 24, margin: 5 }}>
                <IconZ
                    name={this.props.name}
                    size={26}
                    style={{ marginBottom: -3 }}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
                {this.state.badgeCount > 0 && (
                    <View
                        style={{
                            // /If you're using react-native < 0.57 overflow outside of the parent
                            // will not work on Android, see https://git.io/fhLJ8
                            position: 'absolute',
                            right: -6,
                            top: -3,
                            backgroundColor: 'red',
                            borderRadius: 6,
                            width: 12,
                            height: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                            {this.state.badgeCount}
                        </Text>
                    </View>
                )}
            </View>
        )
    }

    async componentDidMount() {
        // Hàm lắng nghe notification
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = notification => {
        this.fetchData();
    };

    fetchData() {
        Session.getUserInfo().then((goals) => {
            if (goals != null) { // Nếu đã có session thì chuyển sang trang Home
                var url = Config.BASE_URL + Config.API_EXPOPUSH + 'Expo_ListNotification';
                var data = {
                    UserId: goals.UserId,
                    TokenExpo: goals.Token
                };

                return fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        if (!response.ok) {
                            console.warn("response = " + JSON.stringify(response));
                        }

                        return response.json();
                    })
                    .then((responseAsJson) => {
                        const pizzerie = responseAsJson.filter((item) => {
                            return item.IsRead == false
                        })

                        this.setState({
                            badgeCount: pizzerie.length
                        });
                    })
                    .catch(function (error) {
                        console.warn('Lỗi = ' + error);
                    });
            }
        })
    }
}