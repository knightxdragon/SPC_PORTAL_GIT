import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import HTMLView from 'react-native-htmlview';

import Styles from '../../Styles';

import {
    Layout,
    Icon,
    Text,
    Card,
} from '@ui-kitten/components';

const heightEx = 30;

export default class TemplateHTML extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: this.props.tabNavigation,
            item: this.props.parItem,
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

    render() {
        return (
            <TouchableOpacity onPress={() => this.state.navigation.navigate('ChiTietLichTuan', { IDLich: this.state.item.IDLich })}>
                <Layout style={Styles.lt_detailContent}>
                    <Layout style={Styles.flexFull}>
                        <Layout style={Styles.lt_top}>
                            <Layout style={Styles.lt_time}>
                                <Text style={Styles.mttGioBatDau}>
                                    {this.state.item.Gio}
                                </Text>
                                <Layout>
                                    <Icon name='arrow-downward' width={16} height={16} fill='#3366FF' />
                                </Layout>
                                <Text>
                                    {this.state.item.GioKT}
                                </Text>
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
                                    Chủ trì: <Text>{this.state.item.ChuTri}</Text>
                                </Text>
                            </Layout>
                            <Layout style={Styles.lt_bor_warning}>
                                <Text appearance='hint'>
                                    Địa điểm: <Text>{this.state.item.DiaDiem}</Text>
                                </Text>
                            </Layout>
                        </Layout>
                        <Layout style={Styles.lt_time}>

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
                </Layout>
            </TouchableOpacity>
        )
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
}