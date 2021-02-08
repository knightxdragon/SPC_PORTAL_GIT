import React, { Component } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    View,
    Image,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import APICall from '../class/APICall';
import Config from '../class/Config';
import ErrorMessage from '../class/ErrorMessage';
import { GlobalContext } from '../components/GlobalContext';
import * as IK from '../components/IconKitten';
import MyActivityIndicator from '../components/MyActivityIndicator';
import Session from '../components/Session';
import Styles from './Styles';
import validateForm from '../components/Validation';

import {
    Select,
    Input,
    Button,
} from '@ui-kitten/components';

const fixedDimesion = 120;

export default class DangNhapScreen extends Component {
    static contextType = GlobalContext; // Nhận biến global

    // Nav + số thứ tự: khi thấy biến này tức là hướng dẫn các bước để điều hướng sang các screen khác
    // Hàm khởi tạo
    constructor(props) {
        super(props);
        // Biến giữ trạng thái
        this.state = {
            userID: null,
            selectedOpt: null,
            selected: null, // lưu giá trị <select> Đơn Vị
            icon: 'eye', // lưu giá trị icon
            secure: true, // bật tính năng dấu *
            user: '', // lưu giá trị tên đăng nhập
            pass: '', // lưu giá trị mật khẩu
            isLoading: true, // trạng thái ẩn/hiện activity
            dataSource: [], // lưu trữ dữ liệu json Đơn Vị
            userError: '', // lưu message lỗi của user
            passError: '', // lưu message lỗi của pass
            donViError: '', // lưu message lỗi của đơn vị
            userField: 'user', // đặt tên field validate cho user
            passField: 'pass', // đặt tên field validate cho pass
            donViField: 'donvi', // đặt tên field validate cho đơn vị
            token: '',
            error: '',
            disabledButton: false, // cờ bật/tắt hiển thị button
            disabledIndicator: true // cờ bật/tắt hiển thị indicator
        };

        this.authenticate = this.authenticate.bind(this); // Nav1: dùng để điều hướng
        this.componentWillReceiveProps = null; // Only way I can turn that warning off
    }

    conditionRender() {
        if (!this.state.isLoading) {
            return (
                <View style={Styles.dn_GeneralContainer}>
                    <View style={Styles.dn_headerContainer}>
                        <Image style={{ width: fixedDimesion, height: fixedDimesion }} source={require('../assets/Logo.png')} />
                    </View>
                    <View style={Styles.dn_formContainer}>
                        <View style={Styles.lt_time}>
                            {this.state.userID === null &&
                                <Select
                                    placeholder={'Chọn đơn vị'}
                                    status='primary'
                                    data={this.state.dataSource}
                                    selectedOption={this.state.selectedOpt}
                                    onSelect={(value) => { this.setState({ selectedOpt: value, selected: value.id }) }}
                                />
                            }
                        </View>
                        <View style={Styles.lt_time}>
                            <Input
                                status='primary'
                                placeholder='Tên tài khoản'
                                icon={IK.Person}
                                caption={this.state.userError != '' ? this.state.userError : ''}
                                captionStyle={Styles.dn_caption}
                                onChangeText={(value) => this.setState({ user: value.trim() })}
                                onBlur={() => {
                                    this.setState({
                                        userError: validateForm(this.state.userField, this.state.user)
                                    })
                                }}
                            />
                        </View>
                        <View style={Styles.lt_time}>
                            <Input
                                status='primary'
                                placeholder='Mật khẩu'
                                icon={this.state.secure ? IK.Eye : IK.EyeOff}
                                caption={this.state.passError != '' ? this.state.passError : ''}
                                captionStyle={Styles.dn_caption}
                                secureTextEntry={this.state.secure}
                                onIconPress={() => { this.changeIcon() }}
                                onChangeText={(value) => this.setState({ pass: value.trim() })}
                                onBlur={() => {
                                    this.setState({
                                        passError: validateForm(this.state.passField, this.state.pass)
                                    })
                                }}
                            />
                        </View>
                        <View style={Styles.lt_time}>
                            <Button
                                disabled={this.state.disabledButton}
                                style={Styles.dn_btnLogin}
                                icon={IK.Login}
                                onPress={() => {
                                    this.authenticate() /* Nav3 */
                                }}
                            >
                                Đăng Nhập
                            </Button>
                            {this.renderIndicator()}
                        </View>
                    </View>
                </View>
            )
        }
        else {
            return (
                <MyActivityIndicator />
            )
        }
    }

    render() {
        const urlImg = './../assets/images/background.png'; // Đường dẫn image background

        return (
            <ImageBackground source={require(urlImg)} style={Styles.dn_imgBackground}>
                <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={Styles.flexFull}>
                    {this.conditionRender()}
                </KeyboardAvoidingView>
            </ImageBackground>
        )
    }

    // Hàm componentDidMount được gọi sau khi render xong
    componentDidMount() {
        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals
            }, () => {
                var url = Config.BASE_URL + Config.API_HETHONG + 'HT_DonVi_GetDanhSach';

                APICall.callPostNoAuthentication(url).then((responseAsJson) => {
                    let res = JSON.stringify(responseAsJson);
                    var newArr = [];
        
                    if (typeof res != 'undefined') {
                        Object.values(responseAsJson).map(function (item) {
                            var dataNew = {
                                id: item.MaDB,
                                text: item.FullName
                            };
                            newArr.push(dataNew);
                        })
                    }
        
                    this.setState({
                        isLoading: false,
                        dataSource: newArr
                    });
                })
            })
        })
    }

    async registerForPushNotificationsAsync() {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;

            return token;
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };

    // Hàm kiểm tra đăng nhập
    authenticate() {
        var getUser = this.state.user; // lấy giá trị người dùng nhập vào ô tên đăng nhập
        var getPass = this.state.pass; // lấy giá trị người dùng nhập vào ô mật khẩu
        var getDonVi = this.state.selected === null ? this.state.userID.MaDB : this.state.selected; // lấy giá trị người dùng chọn đơn vị

        var checkUser = validateForm(this.state.userField, getUser);
        var checkPass = validateForm(this.state.passField, getPass);
        var checkDonVi = validateForm(this.state.donViField, getDonVi);

        this.setState({
            userError: checkUser,
            passError: checkPass,
            donViError: checkDonVi,
            disabledButton: true,
            disabledIndicator: false
        })

        //if (checkUser == null && checkPass == null && checkDonVi == null) {
        this.registerForPushNotificationsAsync().then((value) => {
            var expoToken = value;
            var url = Config.BASE_URL + Config.API_HETHONG + 'HT_User_CheckLogin';
            var data = {
                UserName: getUser,
                PassWord: getPass,
                MaDB: getDonVi,
                TokenExpo: expoToken
            };

            const request = async () => {
                await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        if (!response.ok) {
                            return response;
                        }
                        else {
                            return response.json();
                        }
                    })
                    .then((responseAsJson) => {
                        if (responseAsJson.UserId != undefined) {
                            this.setState({
                                disabledIndicator: true
                            }, () => {
                                Session.removeUserInfo();
                                Session.saveCustomValue("userData", responseAsJson);

                                if (typeof this.props.flagLogin !== 'undefined') {
                                    this.updateParentState({ flag: false });
                                }
                                else {
                                    this.context.setProfile(1); // Điều hướng sang trang Home
                                }
                            })
                        }
                        else {
                            alert(ErrorMessage.ERROR_DANGNHAP);
                            this.setState({
                                disabledButton: false,
                                disabledIndicator: true
                            })

                            console.warn("StatusCode = " + responseAsJson.status);
                        }
                    })
                    .catch(function (error) {
                        this.setState({
                            disabledButton: false,
                            disabledIndicator: true
                        })

                        alert(error.message);
                    });
            }

            request();
        })
            .catch((error) => {
                this.setState({
                    disabledButton: false,
                    disabledIndicator: true
                })

                alert(error.message);
            })
    }

    renderIndicator() {
        if (this.state.disabledIndicator == false) {
            return (
                <MyActivityIndicator />
            )
        }
    }

    // Hàm thay đổi icon
    changeIcon() {
        this.setState(prevState => ({ // prevState: lưu giá trị state trước đó
            icon: prevState.icon == 'eye' ? 'eye-off' : 'eye',
            secure: !prevState.secure
        }))
    }

    updateParentState(data) {
        this.props.updateParentState(data);
    }
}