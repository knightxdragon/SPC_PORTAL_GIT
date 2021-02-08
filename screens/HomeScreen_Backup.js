import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import * as Notifications from 'expo-notifications';

import APICall from '../class/APICall';
import Config from '../class/Config';
import ErrorMessage from '../class/ErrorMessage';
import MyActivityIndicator from '../components/MyActivityIndicator';
import Session from '../components/Session';
import Styles from './Styles';
import TextMessage from '../class/TextMessage';

import {
    Card,
    Text,
    Layout,
    Avatar,
    Icon,
    Button,
} from '@ui-kitten/components'

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';
const heightEx = 300;
const more = "Mở rộng";
const less = "Rút gọn";
const indexExtend = 2;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default class HomeScreenBackup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curDate: moment(),
            userID: null,
            notification: null, // cờ trạng thái thông báo

            dataSource: [], // lưu trữ dữ liệu json
            loading: true,
            expanded: false,

            dataSourceCV: [], // lưu trữ dữ liệu json
            loadingCV: true,
            expandedCV: false,
        };

        this._isMounted = false;
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Trang chủ',
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} onPress={() => navigation.navigate('Settings')}>
                    <Avatar style={{ marginRight: 20 }} size='tiny' source={require('../../assets/person.png')} />
                </TouchableOpacity>
            )
        };
    };

    renderCardHeader(value) {
        return (
            <View style={Styles.bd_left_primary}>
                <Text style={Styles.cardHeader}>{value}</Text>
            </View>
        )
    }

    render() {
        const { navigation } = this.props;

        return (
            <Layout style={Styles.flexFull}>
                <ScrollView>
                    <Layout style={Styles.flexFull}>
                        <Layout style={Styles.marHorVer10}>
                            <Card status='danger' header={() => this.renderCardHeader('Lịch tuần của tôi')} style={Styles.h_marginBottom}>
                                {this.renderLichTuan()}
                            </Card>
                            <Card status='primary' header={() => this.renderCardHeader('Công việc của tôi')} style={Styles.h_marginBottom}>
                                {this.renderCongViec()}
                            </Card>
                        </Layout>
                    </Layout>
                </ScrollView>
            </Layout>
        )
    }

    componentDidMount() {
        this._isMounted = true;

        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId
            }, () => {
                this.fetchDataLichTuan();
                this.fetchDataCongViec();
            })
        });

        // Hàm lắng nghe notification
        Notifications.addNotificationReceivedListener(this._handleNotification);
        Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
    }

    //#region Lịch tuần
    renderLichTuan() {
        if (!this.state.loading) {
            return (
                <Layout>
                    <Layout style={this.state.expanded ? { minHeight: heightEx } : { maxHeight: heightEx, overflow: 'hidden' }}>
                        <ScrollView>
                            {this.conditionRenderLichTuan()}
                        </ScrollView>
                    </Layout>
                    {this.conditionRenderLTExtend()}
                </Layout>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    conditionRenderLTExtend() {
        let dataS = this.state.dataSource;

        if (dataS != null) {
            if (dataS.length > indexExtend) {
                return (
                    <Button status='primary' appearance='outline' onPress={() => this.setState({ expanded: !this.state.expanded })}>
                        {!this.state.expanded ? more : less}
                    </Button>
                )
            }
        }
    }

    conditionRenderLichTuan() {
        let dataS = this.state.dataSource;

        if (dataS != null) {
            if (dataS.length > 0) {
                return dataS.map((item, key) => (
                    <TouchableOpacity key={key} onPress={() => this.props.navigation.navigate('ChiTietLichTuan', { IDLich: item.IDLich })}>
                        <Layout style={Styles.h_detailContent}>
                            <Layout style={Styles.flexFull}>
                                <Layout style={Styles.lt_top}>
                                    <Layout style={Styles.lt_time}>
                                        <Layout style={Styles.lt_time}>
                                            <Text style={Styles.mttGioBatDau}>
                                                {item.TGianBatDau}
                                            </Text>
                                            <Text style={Styles.mttGioBatDau}>
                                                {item.Gio}
                                            </Text>
                                            <Layout>
                                                <Icon name='arrow-downward' width={16} height={16} fill='#3366FF' />
                                            </Layout>
                                            <Text>{item.GioKT}</Text>
                                        </Layout>
                                    </Layout>
                                    <Layout style={Styles.lt_status}>
                                        <Layout style={Styles.flexDirectionColumn}>
                                            {this.conditionLayout(item)}
                                            <Layout style={Styles.lt_time}>
                                                <HTMLView
                                                    value={item.NoiDung.trim()}
                                                    stylesheet={this.renderStyles(item.MauHienThi)}
                                                />
                                            </Layout>
                                        </Layout>
                                    </Layout>
                                </Layout>
                                <Layout style={Styles.lt_time}>
                                    <Layout>
                                        <Text appearance='hint'>
                                            Chủ trì: <Text>{item.ChuTri}</Text>
                                        </Text>
                                    </Layout>
                                </Layout>
                                <Layout style={Styles.lt_time}>
                                    <Layout>
                                        <Text appearance='hint'>
                                            Địa điểm: <Text>{item.DiaDiem}</Text>
                                        </Text>
                                    </Layout>
                                </Layout>
                            </Layout>
                        </Layout>
                    </TouchableOpacity>
                ))
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOLICH);
            }
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOLICH);
        }
    }

    conditionTimeRender(item) {
        if (item.HNTH == true) {
            return (
                <Layout style={Styles.flexDirectionRow}>
                    <Icon name="video" width={16} height={16} fill='#dc3545' />
                    <Text style={Styles.mttHNTH}>
                        {' '}HN trực tuyến
                    </Text>
                </Layout>
            )
        }
    }

    conditionLayout(arr) {
        return (
            <Layout style={Styles.lt_status_inside}>
                <Layout>
                    {this.renderListTrangThai(arr)}
                </Layout>
                <Layout>
                    <HTMLView
                        value={arr.HinhThuc}
                        stylesheet={this.renderStyles(arr.MauHienThi)}
                    />
                </Layout>
            </Layout>
        )
    }

    renderListTrangThai(arr) {
        var list = arr.DsTrangThai.map((item, key) => {
            return (
                <Text key={key} style={this.renderStylesText(item.MauHienThi)}>
                    {item.TenTrangThai == '' ? '' : '(' + item.TenTrangThai + ') '}
                </Text>
            )
        })

        return list;
    }

    fetchDataLichTuan() {
        var standardDate = moment.utc(this.state.curDate, fmtVI).local();
        var valueDate = standardDate.format(fmtEN);

        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanCaNhanNgay';
        var data = {
            Ngay: valueDate,
            UserId: this.state.userID,
            LoaiLich: ''
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (this._isMounted) {
                this.setState({
                    dataSource: responseAsJson,
                    loading: false
                });
            }
        })
    }

    renderStyles(myColor) {
        return {
            p: {
                fontWeight: 'bold',
                //color: '#' + myColor,
            }
        }
    }

    renderStylesText(myColor) {
        return {
            fontWeight: 'bold',
            color: '#' + myColor
        }
    }
    //#endregion

    //#region Công việc
    renderCongViec() {
        if (!this.state.loadingCV) {
            return (
                <Layout>
                    <Layout style={this.state.expandedCV ? { minHeight: heightEx } : { maxHeight: heightEx, overflow: 'hidden' }}>
                        <ScrollView>
                            {this.conditionRenderCongViec()}
                        </ScrollView>
                    </Layout>
                    {this.conditionRenderCVExtend()}
                </Layout>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    conditionRenderCVExtend() {
        let dataCV = this.state.dataSourceCV;

        if (dataCV != null) {
            if (dataCV.length > indexExtend) {
                return (
                    <Button status='primary' appearance='outline' onPress={() => this.setState({ expandedCV: !this.state.expandedCV })}>
                        {!this.state.expandedCV ? more : less}
                    </Button>
                )
            }
        }
    }

    conditionRenderCongViec() {
        let dataCV = this.state.dataSourceCV;

        if (dataCV != null) {
            if (dataCV.length > 0) {
                return dataCV.map((item, key) => (
                    <TouchableOpacity key={key} onPress={() => this.props.navigation.navigate('ChiTietCongViec', { MaCongViec: item.MaCongViec, VaiTro: '', LoaiPC: item.LoaiPC })}>
                        <Layout style={Styles.h_detailContent}>
                            <Layout style={Styles.flexFull}>
                                <Layout style={Styles.lt_time}>
                                    <Text>
                                        {item.TenCongViec}
                                    </Text>
                                </Layout>
                            </Layout>
                        </Layout>
                    </TouchableOpacity>
                ))
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_GIAMSATCONGVIEC);
            }
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_GIAMSATCONGVIEC);
        }
    }

    fetchDataCongViec() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_GetCongViecByDuAnNhanVien';
        var data = {
            UserId: this.state.userID,
            TrangThai: '00CHT'
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (this._isMounted) {
                this.setState({
                    dataSourceCV: responseAsJson,
                    loadingCV: false
                });
            }
        })
    }
    //#endregion

    _handleNotificationResponse = response => {
        console.log(response);
    };

    _handleNotification = notification => {
        if (notification.origin === 'selected') { // khi người dùng nhấn vào notification trên system tray của điện thoại
            var item = notification.data;
            var getDate = moment();
            var curDate = moment.utc(getDate, fmtVI).local().format(fmtEN);
            var url = Config.BASE_URL + Config.API_EXPOPUSH + 'Expo_ReadNotification';
            var data = {
                NotifyID: item.NotifyID,
                ReadDate: curDate
            };

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    if (!response.ok) {
                        console.log("response = " + JSON.stringify(response));

                        return;
                    }

                    return response.json();
                })
                .then((responseAsJson) => {
                    if (this._isMounted) {
                        if (item.ModuledID == 'LT') { // Module Lịch Tuần
                            this.props.navigation.navigate("ChiTietLichTuan", { IDLich: item.Item });
                        }
                        else {
                            this.props.navigation.navigate("ChiTietCongViec", { MaCongViec: item.Item });
                        }
                    }
                })
                .catch(function (error) {
                    console.log('Lỗi = ' + error);
                });
        }
    };
}