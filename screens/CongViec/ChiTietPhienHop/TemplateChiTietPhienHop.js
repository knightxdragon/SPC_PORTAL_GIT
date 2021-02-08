import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import moment from 'moment';

import * as IK from '../../../components/IconKitten';
import Styles from '../../Styles';

import {
    Button,
    Layout,
    Text
} from '@ui-kitten/components';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';

export default class TemplateChiTietPhienHop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: this.props.parNavigation,
            item: this.props.parItem,
            vaiTro: this.props.parVaiTro
        }
    }

    render() {
        const NgayBDau = moment.utc(this.state.item.NgayBDau, fmtEN).local().format(fmtVI);
        const NgayKThuc = moment.utc(this.state.item.NgayKThuc, fmtEN).local().format(fmtVI);

        return (
            <TouchableOpacity onPress={() => {
                this.state.navigation.navigate('ChiTietCongViec', { MaCongViec: this.state.item.MaCongViec, VaiTro: this.state.vaiTro, LoaiPC: this.state.item.LoaiPC })
            }}>
                <Layout style={Styles.lt_detailContent}>
                    <Layout style={Styles.lt_time}>
                        <Text style={{ color: this.state.item.Color }}>
                            {this.state.item.TenCongViec}
                        </Text>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        <Text>
                            <Text appearance='hint'>TG thực hiện: </Text>
                            <Text>{this.state.item.NgayBDau != null ? NgayBDau : ''}{this.state.item.NgayKThuc != null ? ' đến ' + NgayKThuc : ''}</Text>
                        </Text>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        <Text>
                            <Text appearance='hint'>Thực hiện: </Text>
                            <Text>{this.state.item.ThucHien}</Text>
                        </Text>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        <Text>
                            <Text appearance='hint'>Trạng thái: </Text>
                            <Text>{this.state.item.TrangThai}</Text>
                        </Text>
                    </Layout>
                    <Layout style={Styles.lt_time}>
                        <Button appearance='outline' icon={IK.PersonDone} onPress={() => {
                            this.state.navigation.navigate('PhanCongCongViec', { MaCongViec: this.state.item.MaCongViec, VaiTro: this.state.vaiTro, TenCongViec: this.state.item.TenCongViec })
                        }}>
                            Phân công
                        </Button>
                    </Layout>
                </Layout>
            </TouchableOpacity>
        )
    }
}