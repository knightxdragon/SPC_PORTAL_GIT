import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MyActivityIndicator from '../../components/MyActivityIndicator';
import Config from '../../class/Config';
import Session from '../../components/Session';
import Styles from '../Styles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import IconZ from '../../components/IconZ';
import moment from 'moment';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';
const sizeIcon = 34;

export default class TabThongTin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getParentMaCongViec: this.props.parMaCongViec, // lấy tham số ngày từ component cha
            userID: null,
            dataSource: [], // lưu trữ dữ liệu json
            loading: true
        }
    }

    conditionRender() {
        const item = this.state.dataSource;
        const NgayKThuc = moment.utc(item.NgayKThuc, fmtEN).local().format(fmtVI);
        
        return (
            <View style={Styles.detailContent}>
                <Grid style={{ flex: 1 }}>
                    <Row>
                        <Col>
                            <Text style={Styles.textBold}>
                                {item.TenCongViec}
                            </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ paddingTop: 25}}>
                            <Grid>
                                <Row>
                                    <Col style={{width: 40}}>
                                        <IconZ name='square-outline' size={sizeIcon} />
                                    </Col>
                                    <Col style={stylesInFile.content8}>
                                        <Text style={Styles.mttChuTri}>
                                            {item.TrangThai}
                                        </Text>
                                    </Col>
                                    <Col style={stylesInFile.contentIcon}>
                                        <IconZ name='arrow-down' size={sizeIcon} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{width: 40}}>
                                        <IconZ name='calendar' size={sizeIcon} />
                                    </Col>
                                    <Col style={stylesInFile.content4}>
                                        <Text style={Styles.mttChuTri}>TG hoàn thành</Text>
                                    </Col>
                                    <Col style={stylesInFile.content4}>
                                        <Text style={Styles.mttChuTri}>
                                            {NgayKThuc}
                                        </Text>
                                    </Col>
                                    <Col style={stylesInFile.contentIcon}>                                        
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{width: 40}}>
                                        <IconZ name='people' size={sizeIcon} />
                                    </Col>
                                    <Col style={stylesInFile.content8}>
                                        <Text style={Styles.mttChuTri}>
                                            Thực hiện: {item.MaCongViec}
                                        </Text>
                                    </Col>
                                    <Col style={stylesInFile.contentIcon}>
                                        <IconZ name='person-add' size={sizeIcon} />
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                    </Row>
                </Grid>
            </View>
        )
    }

    render() {
        if (!this.state.loading) {
            return (
                <View style={Styles.content}>
                    {this.conditionRender()}
                </View>
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
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_CongViecGetChiTiet';
        var data = {
            MaCongViec: this.state.getParentMaCongViec,
            UserId: this.state.userID
        };

        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (!response.ok) {
                    console.warn("response = " + JSON.stringify(response));
                }

                return response.json();
            })
            .then((responseAsJson) => {
                this.setState({
                    dataSource: responseAsJson,
                    loading: false
                });
            })
            .catch(function (error) {
                console.warn('Lỗi = ' + error);
            });
    }
}

const stylesInFile = StyleSheet.create({
    contentIcon: {
        width: 40,
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content8: {
        flex: 10,
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'left', 
        justifyContent: 'flex-start'
    },
    content4: {
        flex: 5,
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'left', 
        justifyContent: 'flex-start'
    },
});