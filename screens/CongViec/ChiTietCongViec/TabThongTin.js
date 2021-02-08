import React, { Component } from 'react'
import moment from 'moment';

import APICall from '../../../class/APICall';
import Config from '../../../class/Config';
import ErrorMessage from '../../../class/ErrorMessage';
import * as IK from '../../../components/IconKitten';
import ModalLogin from '../../../components/ModalLogin';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Session from '../../../components/Session';
import Styles from '../../Styles';
import TextMessage from '../../../class/TextMessage';

import {
    Layout,
    Button,
    Text
} from '@ui-kitten/components';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';
const sizeIcon = 34;

export default class TabThongTin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: this.props.parNavigation,
            getParentMaCongViec: this.props.parMaCongViec, // lấy tham số từ component cha
            getParentVaiTro: this.props.parVaiTro, // lấy tham số từ component cha
            userID: null,
            dataSource: [], // lưu trữ dữ liệu json
            loading: true,
            visible: false
        }
    }

    conditionRender() {
        const item = this.state.dataSource;

        if (item != null) {
            const NgayBDau = moment.utc(item.NgayBDau, fmtEN).local().format(fmtVI);
            const NgayKThuc = moment.utc(item.NgayKThuc, fmtEN).local().format(fmtVI);

            return (
                <Layout style={Styles.flexFull}>
                    <Layout style={Styles.lt_time}>
                        <Text style={Styles.textBold}>
                            {item.TenCongViec}
                        </Text>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        <Text>
                            <Text appearance='hint'>TG thực hiện: </Text>
                            <Text>{item.NgayBDau != null ? NgayBDau : ''}{item.NgayKThuc != null ? ' đến ' + NgayKThuc : ''}</Text>
                        </Text>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        <Text>
                            <Text appearance='hint'>Thực hiện: </Text>
                            <Text>{item.ThucHien}</Text>
                        </Text>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        <Text>
                            <Text appearance='hint'>Trạng thái: </Text>
                            <Text>{item.TrangThai}</Text>
                        </Text>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        {
                            this.state.getParentVaiTro != '' &&
                            <Button appearance='outline' icon={IK.PersonDone} onPress={() => {
                                this.state.navigation.navigate('PhanCongCongViec', { MaCongViec: this.state.getParentMaCongViec, VaiTro: this.state.getParentVaiTro, TenCongViec: item.TenCongViec })
                            }}>
                                Phân công
                            </Button>
                        }
                    </Layout>
                </Layout>
            )
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_CHITIETPHIENHOP);
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <Layout style={Styles.flexFullContent}>
                    <ScrollView>
                        {this.conditionRender()}
                    </ScrollView>
                    <ModalLogin visible={this.state.visible} />
                </Layout>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.state.navigation.removeListener();
    }

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        this.focusListener = this.state.navigation.addListener('focus', () => {
            Session.getUserInfo().then((goals) => {
                this.setState({
                    userID: goals.UserId
                }, () => {
                    this.fetchData();
                })
            });
        })
    }

    fetchData() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_CongViecGetChiTiet';
        var data = {
            MaCongViec: this.state.getParentMaCongViec,
            VaiTro: this.state.getParentVaiTro,
            UserId: this.state.userID
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (typeof responseAsJson.status !== 'undefined') {
                if (responseAsJson.status === 401) { // Invalid token
                    this.setState({
                        visible: true,
                        loading: false
                    })
                }
            }
            else {
                this.setState({
                    dataSource: responseAsJson,
                    loading: false
                });
            }
        })
    }
}