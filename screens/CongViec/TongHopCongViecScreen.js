import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from 'react-native';

import APICall from "../../class/APICall";
import Config from '../../class/Config';
import ErrorMessage from '../../class/ErrorMessage';
import IconZ from '../../components/IconZ';
import ModalLogin from '../../components/ModalLogin';
import MyActivityIndicator from '../../components/MyActivityIndicator';
import Session from '../../components/Session';
import Styles from '../Styles';
import TextMessage from "../../class/TextMessage";

import {
    Layout,
    Text,
} from '@ui-kitten/components';

const sizeIcon = 16

export default class TongHopCongViecScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: null,
            dataSource: [],
            loading: true,
            visible: false
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <Layout style={Styles.flexFull}>
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

    componentDidMount() {
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year

        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId
            }, () => {
                var url = Config.BASE_URL + Config.API_GSCV + 'GS_GetDanhSachThang';
                var data = {
                    UserId: goals.UserId,
                    Thang: month,
                    Nam: year,
                    LoaiDuAn: ""
                }

                APICall.callPostData(url, data).then((responseJson) => {
                    if (typeof responseAsJson.status !== 'undefined') {
                        if (responseAsJson.status === 401) { // Invalid token
                            this.setState({
                                visible: true,
                                loading: false
                            })
                        }
                    }
                    else {
                        let res = JSON.stringify(responseJson);
                        var result = [];

                        if (typeof res != 'undefined') {
                            responseJson.forEach(function (e, i) {
                                if (!this[e.TenLoaiDuAn]) {
                                    this[e.TenLoaiDuAn] = {
                                        title: e.TenLoaiDuAn,
                                        content: []
                                    }
                                    this[e.TenLoaiDuAn].content.push(e)
                                    result.push(this[e.TenLoaiDuAn])
                                } else {
                                    this[e.TenLoaiDuAn].content.push(e)
                                }
                            }, {})
                        }

                        this.setState({
                            dataSource: result,
                            loading: false
                        });
                    }
                })
            })
        });
    }

    conditionRender() {
        let dataS = this.state.dataSource;

        if (dataS != null) {
            if (dataS.length > 0) {
                const list = dataS.map((itemSource, key) => {
                    return (
                        <Layout key={key}>
                            <Layout style={Styles.gscv_header}>
                                <Text status='primary' category='h6'>
                                    {itemSource.title}
                                </Text>
                            </Layout>
                            <Layout>
                                {this.renderChild(itemSource)}
                            </Layout>
                        </Layout>
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_GIAMSATCONGVIEC)
            }
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_GIAMSATCONGVIEC)
        }
    }

    renderChild(itemSource) {
        const { navigate } = this.props.navigation;
        let source = itemSource.content;

        const list = source.map((item, key) => {
            let parLoaiDuAn = {
                id: item.LoaiDuAn,
                text: item.TenLoaiDuAn
            }

            let parVaiTro = {
                id: item.LoaiDoiTuong,
                text: item.TenLoaiDoiTuong
            }

            return (
                <TouchableOpacity key={key} onPress={() => navigate('CongViec', { IdDoiTuong: item.IdDoiTuong, LoaiDuAn: parLoaiDuAn, VaiTro: parVaiTro })} >
                    <Layout style={Styles.tb_content}>
                        <Layout style={Styles.lt_check}>
                            <Text>
                                <IconZ name='person' size={sizeIcon} />{' '}
                                <Text style={Styles.textSecondaryBold}>{item.TenDoiTuong}</Text>
                            </Text>
                        </Layout>
                        <Layout style={Styles.lt_check}>
                            <Text>
                                Đang xử lý: <Text category='s1'>{item.ChuaGQ}</Text> -
                                Quá hạn: <Text category='s1' status='danger'>{item.QuaHan}</Text> -
                                Đã xử lý: <Text category='s1' status='success'>{item.DaGQ}</Text>
                            </Text>
                        </Layout>
                    </Layout>
                </TouchableOpacity>
            )
        })

        return list;
    }
}