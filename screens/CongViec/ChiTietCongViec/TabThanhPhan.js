import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import moment from 'moment';

import APICall from '../../../class/APICall';
import Config from '../../../class/Config';
import ErrorMessage from '../../../class/ErrorMessage';
import ModalLogin from '../../../components/ModalLogin';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Session from '../../../components/Session';
import Styles from '../../Styles';
import TextMessage from '../../../class/TextMessage';

import {
    Layout,
    Text
} from '@ui-kitten/components';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';
const sizeIcon = 34;

export default class TabThanhPhan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getParentMaCongViec: this.props.parMaCongViec, // lấy tham số ngày từ component cha
            userID: null,
            dataSource: [], // lưu trữ dữ liệu json
            loading: true,
            visible: false
        }
    }

    conditionRender() {
        const item = this.state.dataSource;

        if (item.length > 0) {
            const lapsList = item.map((data, index) => {
                const NgayTao = moment.utc(data.NgayTao, fmtEN).local().format(fmtVI);
                const NgayBDau = moment.utc(data.NgayBDau, fmtEN).local().format(fmtVI);
                const NgayKThuc = moment.utc(data.NgayKThuc, fmtEN).local().format(fmtVI);

                return (
                    <Layout style={Styles.lt_detailContent} key={index}>
                        <Layout style={Styles.lt_time}>
                            <Text status='primary'>{data.TenCongViec}</Text>
                        </Layout>
                        <Layout style={Styles.lt_time}>
                            <Text>Ngày tạo: {NgayTao}</Text>
                        </Layout>
                        <Layout style={Styles.lt_time}>
                            <Text>Ngày bắt đầu: {NgayBDau != null ? NgayBDau : ''}</Text>
                        </Layout>
                        <Layout style={Styles.lt_time}>
                            <Text>Ngày kết thúc: {NgayKThuc != null ? NgayKThuc : ''}</Text>
                        </Layout>
                        <Layout style={Styles.lt_time}>
                            <Text>Người tạo: {data.NguoiTao}</Text>
                        </Layout>
                    </Layout>
                )
            })

            return lapsList;
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_CONGVIECCON);
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

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId
            })

            this.fetchData();
        });
    }

    fetchData() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_CongViecGetCongViecCon';
        var data = {
            MaCongViec: this.state.getParentMaCongViec,
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
