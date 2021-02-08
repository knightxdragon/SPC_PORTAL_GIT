import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Styles from '../Styles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Button, Badge, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import IconZ from '../../components/IconZ';

class ChiTietCV extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.parItem,
            starred: this.props.parItem.Starred,
            getType: this.props.parTypeCT
        }
    }

    DanhDau(checked) {
        this.setState({
            starred: !checked
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        
        return (
            <View style={Styles.thtml_detailContent} >
                <Grid>
                    <Row>
                        <Col style={{ width: 30 }}>
                            <TouchableOpacity onPress={() => { this.DanhDau(this.state.starred) }} >
                                <Icon name={this.state.starred ? "star" : "star-outline"} style={Styles.ctcv_star} />
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity onPress={() => {
                                navigate('ChiTietThongBao', { MaDuAn: this.state.item.MaDuAn, TrangThai: this.state.getType })
                            }} >
                                <Text style={Styles.textBold}>
                                    {this.state.item.TenDuAn}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={Styles.mttChuTri}>
                                Đang: {this.state.item.ChuaGQ}  Đã: {this.state.item.DaGQ}  Quá hạn: {this.state.item.QuaHan}  
                            </Text>
                        </Col>
                    </Row>
                </Grid>
            </View>
        )
    }
}

export default withNavigation(ChiTietCV);