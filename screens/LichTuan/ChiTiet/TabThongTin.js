import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';

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
    Icon,
    Text,
    Card
} from '@ui-kitten/components';

const json_empty = '{}';

export default class TabThongTin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getParentIDLich: this.props.parIDLich, // lấy tham số ngày từ component cha
            userID: null,
            dataSource: [], // lưu trữ dữ liệu json
            loading: true,
            visible: false
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

    conditionRender() {
        const item = this.state.dataSource;

        if (item != json_empty && item !== null) {
            return (
                <Layout style={Styles.flexFull}>
                    <Layout style={Styles.lt_top}>
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
                            <Text>
                                {item.GioKT}
                            </Text>
                        </Layout>
                        <Layout style={Styles.lt_status}>
                            <Layout style={Styles.flexDirectionColumn}>
                                {this.conditionLayout(item)}
                                <Layout style={Styles.lt_time}>
                                    <HTMLView
                                        value={item.NoiDung}
                                        stylesheet={this.renderStyles(item.MauHienThi)} />
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
                        <Layout>
                            <Text appearance='hint'>
                                Địa điểm: <Text>{item.DiaDiem}</Text>
                            </Text>
                        </Layout>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        <Layout style={Styles.lt_bottom}>
                            <Card style={Styles.lt_card_right}>
                                <Layout style={Styles.lt_card_title}>
                                    <Text appearance='hint'>Thành phần</Text>
                                </Layout>
                                <Layout style={Styles.lt_card_content}>
                                    <HTMLView value={item.ThanhPhan} />
                                </Layout>
                            </Card>
                            <Card style={Styles.lt_card_left}>
                                <Layout style={Styles.lt_card_title}>
                                    <Text appearance='hint'>Chuẩn bị</Text>
                                </Layout>
                                <Layout style={Styles.lt_card_content}>
                                    <HTMLView value={item.GhiChu} />
                                </Layout>
                            </Card>
                        </Layout>
                    </Layout>
                </Layout>
            )
        }
        else
            return TextMessage.TextWarning(ErrorMessage.ERROR_CHITIETPHIENHOP);
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

    renderStyles(myColor) {
        return {
            p: {
                fontWeight: 'bold',
                //color: '#' + myColor,
            },
            span: {
                fontWeight: 'bold',
                color: '#ff3d71'
            }
        }
    }

    renderStylesText(myColor) {
        return {
            fontWeight: 'bold',
            color: '#' + myColor
        }
    }

    // Khi có sự kiện thay đổi của parent Component thì tham số của thằng con được nhận sẽ thay đổi theo và chỉ render ở lần thứ 2 
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.parIDLich !== prevState.getParentIDLich) {
            return {
                getParentIDLich: nextProps.parIDLich
            }
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.getParentIDLich != this.state.getParentIDLich) {
            this.setState({
                dataSource: [],
                loading: true
            }, () => {
                this.fetchData(this.state.getParentIDLich);
            })
        }
    }

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId
            }, () => {
                this.fetchData(null);
            })
        });
    }

    fetchData(valueID) {
        const realID = valueID != null ? valueID : this.state.getParentIDLich;
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanChiTiet';
        var data = {
            IDLich: realID,
            //UserId: this.state.userID
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
                if (JSON.stringify(responseAsJson) == json_empty) {
                    this.setState({
                        dataSource: json_empty,
                        loading: false
                    });
                }
                else {
                    this.setState({
                        dataSource: responseAsJson,
                        loading: false
                    });
                }
            }
        })
    }
}
