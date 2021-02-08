import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'

import APICall from '../../../class/APICall';
import Config from '../../../class/Config';
import ErrorMessage from '../../../class/ErrorMessage';
import ModalLogin from '../../../components/ModalLogin';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Session from '../../../components/Session';
import Styles from '../../Styles';
import TextMessage from '../../../class/TextMessage';

import {
    Card,
    Layout,
    Button,
    Text
} from '@ui-kitten/components';

var saveLich = null;
const json_empty = '{}';

export default class TabThanhPhan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getParentIDLich: this.props.parIDLich, // lấy tham số ngày từ component cha
            getNavigation: this.props.parNavigation,
            userID: null,
            dataSource: [], // lưu trữ dữ liệu json nhóm
            dataSourceTT: [], // lưu trữ dữ liệu json thông tin
            loading: true,
            visible: false
        }
    }

    renderCardHeader(value) {
        return (
            <View style={Styles.bd_left_primary}>
                <Text style={Styles.cardHeader}>{value}</Text>
            </View>
        )
    }

    conditionRender() {
        let dataS = this.state.dataSource;

        if (dataS) {
            let values = this.group_to_values(dataS);
            let convert = this.groups(values);

            if (convert.length > 0) {
                let res = convert.map((item, key) => (
                    <Card style={Styles.h_marginBottom} header={() => this.renderCardHeader(item.TenPhong)} status='info' key={key}>
                        <Text>{item.TenHienThi}</Text>
                    </Card>
                ))

                return res;
            }
            else
                return TextMessage.TextWarning(ErrorMessage.ERROR_THANHPHANTHAMDU);
        }
        else
            return TextMessage.TextWarning(ErrorMessage.ERROR_THANHPHANTHAMDU);
    }

    conditionFab() {
        let list = this.state.dataSourceTT;

        if (list != null) {
            if (list.DuocChonNguoiThanDu) {
                return (
                    <Layout style={Styles.h_marginBottom}>
                        <Button appearance='outline' status='warning' onPress={() => this.state.getNavigation.navigate('ThemThanhPhan', { IDLich: this.state.getParentIDLich })}>
                            Thêm thành phần tham dự
                        </Button>
                    </Layout>
                )
            }
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <Layout style={Styles.flexFullContent}>
                    <ScrollView>
                        {this.conditionFab()}
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

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.state.getNavigation.removeListener();
    }

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        this.focusListener = this.state.getNavigation.addListener('focus', () => {
            Session.getUserInfo().then((goals) => {
                this.setState({
                    userID: goals.UserId,
                    loading: true
                }, () => {
                    this.fetchData(saveLich);
                })
            });
        });
    }

    fetchData(valueID) {
        const realID = valueID != null ? valueID : this.state.getParentIDLich;
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanThamDu';
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
                this.setState({
                    dataSource: responseAsJson,
                    loading: false
                }, () => {
                    this.fetchDataThongTin(valueID);
                });
            }
        })
    }

    fetchDataThongTin(valueID) {
        const realID = valueID != null ? valueID : this.state.getParentIDLich;
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanChiTiet';
        var data = {
            IDLich: realID,
            //UserId: this.state.userID
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (JSON.stringify(responseAsJson) == json_empty) {
                this.setState({
                    dataSourceTT: json_empty
                });
            }
            else {
                this.setState({
                    dataSourceTT: responseAsJson,
                    loading: false
                });
            }
        })
    }

    group_to_values(myArray) {
        const result = myArray.reduce(function (obj, item) {
            item.TenHienThi = item.TenHienThi.trim();
            obj[item.TenPhong] = obj[item.TenPhong] || [];
            obj[item.TenPhong].push(item.TenHienThi + "\n");

            return obj;
        }, {})

        return result;
    };

    groups(group_to_values) {
        const result = Object.keys(group_to_values).map(function (key) {
            return { TenPhong: key, TenHienThi: group_to_values[key] };
        })

        return result;
    };
}