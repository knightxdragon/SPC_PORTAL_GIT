import React, { Component } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';

import Config from '../../../class/Config';
import IconZ from '../../../components/IconZ';
import * as IK from '../../../components/IconKitten';
import Styles from '../../Styles';

import {
    Layout,
    Icon,
    Text,
    Card,
    Button
} from '@ui-kitten/components';
import APICall from '../../../class/APICall';

const fmtVI = 'DD-MM-YYYY';
const fmtTimeVI = 'HH:mm';
const fmtEN = 'YYYY-MM-DD';
const sizeIcon = 15;
const heightEx = 30;

export default class TemplateDuyetHTML extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: this.props.tabNavigation,
            item: this.props.parItem,
            userID: this.props.parUserID,
            invi: this.props.parInvi,
            inviK: this.props.parInviK,
            type: this.props.parType,
            disabledButton: false,
            textTrangThai: '',
            colorTrangThai: '',
            iconTrangThai: '',
            expanded: false,
            expandedCB: false,
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

    conditionTimeOut(ngayBatDau, ngayKetThuc, gioKetThuc) {
        if (ngayKetThuc == ngayBatDau) {
            return (
                <Text>{gioKetThuc}</Text>
            )
        }
        else {
            <Layout>
                <Text>{ngayKetThuc}</Text>
                <Text>{gioKetThuc}</Text>
            </Layout>
        }
    }

    returnType() {
        if (this.state.type == 1)
            return 'Duyệt';
        else
            return 'Xuất Bản';
    }

    render() {
        var ngayBatDau = moment(this.state.item.BatDau).format(fmtVI);
        var ngayKetThuc = moment(this.state.item.KetThuc).format(fmtVI);
        var gioBatDau = moment(this.state.item.BatDau).format(fmtTimeVI);
        var gioKetThuc = moment(this.state.item.KetThuc).format(fmtTimeVI);
        var val = this.returnType();

        return (
            <TouchableOpacity onPress={() => this.state.navigation.navigate('ChiTietLichTuan', { IDLich: this.state.item.IDLich })}>
                <Layout style={Styles.lt_detailContent}>
                    <Layout style={Styles.flexFull}>
                        <Layout style={Styles.lt_top}>
                            <Layout style={Styles.lt_time}>
                                {/* <Text style={Styles.mttGioBatDau}>
                                    {ngayBatDau}
                                </Text> */}
                                <Text style={Styles.mttGioBatDau}>
                                    {gioBatDau}
                                </Text>
                                <Layout>
                                    <Icon name='arrow-downward' width={16} height={16} fill='#3366FF' />
                                </Layout>
                                {this.conditionTimeOut(ngayBatDau, ngayKetThuc, gioKetThuc)}
                            </Layout>
                            <Layout style={Styles.lt_status}>
                                <Layout style={Styles.flexDirectionColumn}>
                                    {this.conditionLayout(this.state.item)}
                                    <Layout style={Styles.lt_time}>
                                        <HTMLView
                                            value={this.state.item.NoiDung.trim()}
                                            stylesheet={this.renderStyles(this.state.item.MauHienThi)}
                                        />
                                    </Layout>
                                </Layout>
                            </Layout>
                        </Layout>
                        <Layout style={Styles.lt_time}>
                            <Layout style={Styles.lt_bor_primary}>
                                <Text appearance='hint'>
                                    Chủ trì: <Text>{this.state.item.PhongCT}</Text>
                                </Text>
                            </Layout>
                            <Layout style={Styles.lt_bor_warning}>
                                <Text appearance='hint'>
                                    Địa điểm: <Text>{this.state.item.DiaDiem}</Text>
                                </Text>
                            </Layout>
                        </Layout>
                        <Layout style={Styles.lt_time}>
                            <Layout>
                                <TouchableOpacity onPress={() => this.setState({ expanded: !this.state.expanded })}>
                                    <Layout style={Styles.lt_card_title}>
                                        <Text appearance='hint'>Thành phần</Text>
                                        <Icon name={this.state.expanded ? 'arrowhead-down' : 'arrowhead-right'} width={16} height={16} fill='#3366FF' />
                                    </Layout>
                                    <Layout style={this.state.expanded ? { minHeight: heightEx } : { maxHeight: heightEx, overflow: 'hidden' }}>
                                        <HTMLView value={this.state.item.ThanhPhan} />
                                    </Layout>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ expandedCB: !this.state.expandedCB })}>
                                    <Layout style={Styles.lt_card_title}>
                                        <Text appearance='hint'>Chuẩn bị</Text>
                                        <Icon name={this.state.expandedCB ? 'arrowhead-down' : 'arrowhead-right'} width={16} height={16} fill='#3366FF' />
                                    </Layout>
                                    <Layout style={this.state.expandedCB ? { minHeight: heightEx } : { maxHeight: heightEx, overflow: 'hidden' }}>
                                        <HTMLView value={this.state.item.GhiChu} />
                                    </Layout>
                                </TouchableOpacity>
                            </Layout>
                        </Layout>
                        <Layout style={Styles.lt_time}>
                            <Layout style={Styles.flexDirectionRow}>
                                {
                                    this.state.item.DuocDuyet && !this.state.disabledButton &&
                                    <Button style={Styles.lt_button_group_left} appearance='outline' status='danger' icon={IK.ArrowBack} onPress={() => { this.callKhongDuyet(this.state.item) }}>
                                        {'Không ' + val}
                                    </Button>
                                }
                                {
                                    this.state.item.DuocDuyet && this.props.parDuyet && !this.state.disabledButton &&
                                    <Button appearance='outline' status='success' icon={IK.CheckMarkCircle} onPress={() => { this.callDuyet(this.state.item) }}>
                                        {val}
                                    </Button>
                                }
                                {
                                    this.state.item.DuocEdit && !this.state.disabledButton &&
                                    <Button style={Styles.lt_button_group_right} appearance='outline' status='primary' icon={IK.Edit} onPress={() => { this.state.navigation.navigate('CapNhatDuyet', { itemK: this.state.item }) }}>
                                        Cập Nhật
                                    </Button>
                                }
                            </Layout>
                            {
                                this.state.item.DuocDuyet && this.state.disabledButton &&
                                <Layout>
                                    <Text style={{ color: this.state.colorTrangThai, fontWeight: 'bold', textAlign: 'right' }}>
                                        <IconZ name={this.state.iconTrangThai} size={16} /> {this.state.textTrangThai}
                                    </Text>
                                </Layout>
                            }
                        </Layout>
                    </Layout>
                </Layout>
            </TouchableOpacity>
        )
    }

    renderStyles(myColor) {
        return {
            p: {
                fontWeight: 'bold',
                //color: '#' + myColor
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

    callDuyet(item) {
        var val = this.returnType();

        Alert.alert(
            //title
            'Thông báo',
            //body
            'Bạn chắc chắn muốn ' + val + ' nội dung này?',
            [
                { text: 'Hủy bỏ', onPress: () => { } },
                {
                    text: 'Xác nhận', onPress: () => {
                        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_DuyetLich';
                        var data = {
                            //UserId: this.state.userID,
                            IDLich: item.IDLich,
                            Duyet: "1"
                        };

                        APICall.callPostData(url, data).then((responseAsJson) => {
                            if (JSON.stringify(responseAsJson).trim() == '""') {
                                this.setState({
                                    disabledButton: true,
                                    colorTrangThai: '#28a745',
                                    iconTrangThai: 'checkmark-circle',
                                    textTrangThai: 'Đã ' + val
                                })
                            }
                            else {
                                Alert(JSON.stringify(responseAsJson));
                            }
                        })
                    }
                },
            ],
            { cancelable: true }
        );
    }

    callKhongDuyet(item) {
        var val = this.returnType();

        Alert.alert(
            //title
            'Thông báo',
            //body
            'Bạn chắc chắn không ' + val + ' nội dung này?',
            [
                { text: 'Hủy bỏ', onPress: () => { } },
                {
                    text: 'Xác nhận', onPress: () => {
                        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_DuyetLich';
                        var data = {
                            //UserId: this.state.userID,
                            IDLich: item.IDLich,
                            Duyet: "0"
                        };

                        APICall.callPostData(url, data).then((responseAsJson) => {
                            if (JSON.stringify(responseAsJson).trim() == '""') {
                                this.setState({
                                    disabledButton: true,
                                    colorTrangThai: '#dc3545',
                                    iconTrangThai: 'close-circle-outline',
                                    textTrangThai: 'Không ' + val
                                })
                            }
                        })
                    }
                },
            ],
            { cancelable: true }
        );
    }
}