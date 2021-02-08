import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View, Card, CardItem, Body, Button } from "native-base";
import Styles from '../Styles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import IconZ from '../../components/IconZ';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';

class TabChiTietAll_GSCV extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.parItem
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const NgayBDau = moment.utc(this.state.item.NgayBDau, fmtEN).local().format(fmtVI);
        const NgayKThuc = moment.utc(this.state.item.NgayKThuc, fmtEN).local().format(fmtVI);
        return (
            <Card>
                <TouchableOpacity onPress={() => {
                    navigate('ChiTietCongViec', { MaCongViec: this.state.item.MaCongViec })
                }} >
                    <CardItem header bordered>
                        <Text>{this.state.item.TenCongViec}</Text>
                    </CardItem>
                </TouchableOpacity>
                <CardItem>
                    <Body>
                        <Text>TG hoàn thành: {NgayKThuc}</Text>
                        <Text>Thực hiện: {NgayBDau}</Text>
                        <Text style={Styles.ctcv_trangthai}>Trạng thái: {this.state.item.TrangThai}</Text>
                    </Body>
                </CardItem>
            </Card>
        )
    }
}

export default withNavigation(TabChiTietAll_GSCV);