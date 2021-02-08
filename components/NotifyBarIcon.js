import React, { Component } from 'react';
import { Platform, Text, View } from 'react-native';
import { Notifications } from 'expo';

import Colors from '../constants/Colors';
import IconZ from '../components/IconZ';
import Session from '../components/Session';

export default function (props) {
    return <NotifyBarIcon {...props} />;
}

class NotifyBarIcon extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false; // cờ bật/tắt hiển thị notification
        this.state = {
            notification: null, // cờ trạng thái thông báo
            badgeCount: 0
        };
    }

    render() {
        return (
            <View style={{ width: 24, height: 24, margin: 5 }}>
                <IconZ
                    name={'notifications'}
                    size={26}
                    style={this.props.select ? { marginBottom: -3, color: Colors.tabIconSelected } : { marginBottom: -3, color: Colors.tabIconDefault }}
                />
                {this.state.badgeCount > 0 && this._isMounted && (
                    <View
                        light
                        bordered
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
                        }}
                        >
                        <Text style={{ 
                            color: 'white', 
                            fontSize: 8, 
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {this.state.badgeCount}
                        </Text>
                    </View>
                )}
                {this.resetBadgeCount()}
            </View>
        )
    }

    async componentDidMount() {
        // Hàm lắng nghe notification
        this._notificationSubscription = Notifications.addListener(this._handleNotification);

        this.fetchData(true);
        this._isMounted = true;
    }

    _handleNotification = notification => {
        this.fetchData(false); // mỗi khi có tín hiệu notification thì sẽ cập nhật badge count
        this._isMounted = true;
    };

    fetchData(flag) {
        Session.getCustomValue("badgeCount").then((value) => {
            var res = 0;
            
            if (value != null) { // Nếu đã có session badgecount
                if (flag) { // dành cho componentdidmount
                    res = value.badgeCount; 
                }
                else { // dành cho handle
                    res = value.badgeCount + 1; // tăng dần
                }
            }
            else { // Nếu chưa tạo session badgecount
                if (flag === false) { // dành cho handle
                    res = 1;
                }
            }

            Session.saveCustomValue("badgeCount", { badgeCount: res });
            this.setState({
                badgeCount: res
            })

            if (flag === false) {
                this._isMounted = false;
            }
        })
    }

    resetBadgeCount() {
        if (this._isMounted === false) {
            Session.saveCustomValue("badgeCount", { badgeCount: 0 });

            // Reset số badge ngoài app - chỉ hỗ trợ cho iOS
            if (Platform.OS === 'ios')
            {
                Notifications.setBadgeNumberAsync(0);
            }
        }
    }
}