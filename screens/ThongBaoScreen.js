import React, { Component } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import moment from 'moment';
import 'moment/locale/vi';
import HTMLView from 'react-native-htmlview';

import APICall from '../class/APICall';
import Config from '../class/Config';
import ErrorMessage from './../class/ErrorMessage';
import IconZ from '../components/IconZ';
import MyActivityIndicator from '../components/MyActivityIndicator';
import Session from '../components/Session';
import Styles from './Styles';
import TextMessage from './../class/TextMessage';

import {
    Layout,
    Text
} from '@ui-kitten/components';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';

export default class ThongBaoScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            dataSource: [], // lưu trữ dữ liệu json
        }
    }

    conditionRender() {
        const dataS1 = [
            {
                TypeID: 'AC02',
                ModuleTitle: 'Lịch tuần',
                TextColor: '7B4AAB',
                TypeName: 'Thay đổi lịch họp',
                IsRead: false,
                NotifyMsg: 'Triển khai kết luận của Thứ trưởng Bộ Công Thương',
                SentDate: new Date()
            },
            {
                TypeID: 'AC03',
                ModuleTitle: 'Lịch tuần',
                TextColor: '17a2b8',
                TypeName: 'Bổ sung lịch họp',
                IsRead: true,
                NotifyMsg: 'Làm việc tại PC An Giang',
                SentDate: new moment().subtract(2, "days")
            },
            {
                TypeID: 'AC04',
                ModuleTitle: 'Lịch tuần',
                TextColor: 'ffc107',
                TypeName: 'Hoãn lịch họp',
                IsRead: true,
                NotifyMsg: 'Làm việc tại PC Bến Tre',
                SentDate: new moment().subtract(3, "days")
            },
            {
                TypeID: 'AC05',
                ModuleTitle: 'Lịch tuần',
                TextColor: 'dc3545',
                TypeName: 'Hủy lịch họp',
                IsRead: false,
                NotifyMsg: 'Làm việc với EVNICT về công tác triển BI',
                SentDate: new moment().subtract(4, "days")
            },
            {
                TypeID: 'GS01',
                ModuleTitle: 'Công việc',
                TextColor: '007bff',
                TypeName: 'Thay đổi công việc',
                IsRead: false,
                NotifyMsg: 'Báo cáo tiến độ xây dựng EVNSOLAR',
                SentDate: new moment().subtract(5, "days")
            }
        ]

        let dataS = this.state.dataSource;

        if (dataS != null) {
            if (dataS.length > 0) {
                return dataS.map((item, key) => (
                    <TouchableOpacity key={key} onPress={() => this.transfer(item)}>
                        <Layout>
                            <View style={this.renderStylesCardItem(item)}>
                                <View style={Styles.tb_content}>
                                    <View style={Styles.flexDirectionRow}>
                                        <View style={Styles.flexFull}>
                                            <Text>
                                                {this.renderTypeIcon(item)}
                                                {'  '}
                                                <Text style={this.renderStylesTitle(item)}>{item.TypeName}</Text>
                                            </Text>
                                        </View>
                                        <View style={Styles.lt_check}>
                                            {this.renderSeenIcon(item)}
                                        </View>
                                    </View>
                                    <View style={Styles.lt_time}>
                                        <HTMLView
                                            value={item.NotifyMsg}
                                        />
                                    </View>
                                    <View style={Styles.lt_time}>
                                        <Text style={Styles.tb_relativeTime}>
                                            {this.renderRelativeTime(item)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Layout>
                    </TouchableOpacity>
                ))
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOTHONGBAO);
            }
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOTHONGBAO);
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <Layout style={Styles.flexFull}>
                    <ScrollView>
                        {this.conditionRender()}
                    </ScrollView>
                </Layout>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    componentDidMount() {
        this.fetchData();

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.setState({
                loading: true
            }, () => {
                this.fetchData()
            })
        });
    }

    fetchData() {
        Session.getUserInfo().then((goals) => {
            if (goals != null) { // Nếu đã có session thì chuyển sang trang Home
                var url = Config.BASE_URL + Config.API_EXPOPUSH + 'Expo_ListNotification';
                var data = {
                    //UserId: goals.UserId,
                    TokenExpo: goals.Token
                };

                APICall.callPostData(url, data).then((responseAsJson) => {
                    this.setState({
                        dataSource: responseAsJson,
                        loading: false
                    });
                })
            }
        })
    }

    transfer(item) {
        if (item.IsRead) { // Đã đọc
            if (item.ModuleID == 'LT') { // Module Lịch Tuần
                this.props.navigation.navigate("ChiTietLichTuan", { IDLich: item.ItemID });
            }
            else {
                this.props.navigation.navigate("ChiTietCongViec", { MaCongViec: item.ItemID });
            }
        }
        else { // Chưa đọc
            // Đánh dấu là đã đọc
            var getDate = moment();
            var curDate = moment.utc(getDate, fmtVI).local().format(fmtEN);
            var url = Config.BASE_URL + Config.API_EXPOPUSH + 'Expo_ReadNotification';
            var data = {
                NotifyID: item.NotifyID,
                ReadDate: curDate
            };

            APICall.callPostData(url, data).then((responseAsJson) => {
                if (item.ModuleID == 'LT') { // Module Lịch Tuần
                    this.props.navigation.navigate("ChiTietLichTuan", { IDLich: item.ItemID });
                }
                else {
                    this.props.navigation.navigate("ChiTietCongViec", { MaCongViec: item.ItemID });
                }
            })
        }
    }

    renderRelativeTime(item) {
        var res = '';

        if (item.SentDate != null) {
            moment.locale('vi');
            res = moment(item.SentDate, "YYYY-MM-DDTHH:mm:ss.SSS").fromNow();
        }

        return res;
    }

    renderStylesCardItem(item) {
        if (item.IsRead) {
            return {
                backgroundColor: 'white'
            }
        }
        else {
            return {
                backgroundColor: '#edf2fa'
            }
        }
    }

    renderStylesTitle(item) {
        return {
            fontWeight: 'bold',
            color: '#' + item.TextColor,
            fontSize: 14
        }
    }

    renderTypeIcon(item) {
        if (item.TypeID == 'AC02') { // Thay đổi lịch họp
            return (
                <IconZ name='refresh' style={{ color: '#' + item.TextColor }} />
            )
        }
        else if (item.TypeID == 'AC03') { // Bổ sung lịch họp
            return (
                <IconZ name='add-circle-outline' style={{ color: '#' + item.TextColor }} />
            )
        }
        else if (item.TypeID == 'AC04') { // Hoãn lịch họp
            return (
                <IconZ name='pause' style={{ color: '#' + item.TextColor }} />
            )
        }
        else if (item.TypeID == 'AC05') { // Hủy lịch họp
            return (
                <IconZ name='close-circle-outline' style={{ color: '#' + item.TextColor }} />
            )
        }
        else if (item.TypeID == 'GS01') { // Thông báo công việc
            return (
                <IconZ name='refresh' style={{ color: '#' + item.TextColor }} />
            )
        }
        else {
            return (
                <IconZ name='square' style={{ color: '#' + item.TextColor }} />
            )
        }
    }

    renderSeenIcon(item) {
        if (item.IsRead) {
            return (
                <IconZ name='checkmark-circle-outline' style={{ color: '#007bff' }} />
            )
        }
    }
}