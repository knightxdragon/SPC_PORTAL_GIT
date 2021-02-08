import React, { Component } from 'react'
import MyActivityIndicator from '../../components/MyActivityIndicator';
import { Text, View, Card, CardItem, Body, Container, Content } from "native-base";
import Config from '../../class/Config';
import ErrorMessage from '../../class/ErrorMessage';
import Session from '../../components/Session';
import Styles from '../Styles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import IconZ from '../../components/IconZ';
import moment from 'moment';

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
            loading: true
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
                    <Card key={index}>
                        <CardItem header bordered>
                            <Text>{data.TenCongViec}</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <Text>Ngày tạo: {NgayTao}</Text>
                                <Text>Ngày bắt đầu: {NgayBDau}</Text>
                                <Text>Ngày kết thúc: {NgayKThuc}</Text>
                            </Body>
                        </CardItem>
                        <CardItem footer bordered>
                            <Text>Người tạo: {data.NguoiTao}</Text>
                        </CardItem>
                    </Card>
                )
            })
            return (
                <Container>
                    <Content>
                        {lapsList}
                    </Content>
                </Container>
            );
        }
        else {
            return (
                <View style={Styles.content}>
                    <Text style={Styles.lbError}>{ ErrorMessage.ERROR_CONGVIECCON }</Text>
                </View>
            )
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                this.conditionRender()
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
