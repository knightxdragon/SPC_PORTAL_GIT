import React, { Component } from 'react'
import MyActivityIndicator from '../../components/MyActivityIndicator';
import { Text, View, Card, CardItem, Body, Container, Content } from "native-base";
import Config from '../../class/Config';
import Session from '../../components/Session';
import Styles from '../Styles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import IconZ from '../../components/IconZ';
import moment from 'moment';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';
const sizeIcon = 34;

export default class TabBaoCao extends Component {
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
                const NgayCN = moment.utc(data.NgayCN, fmtEN).local().format(fmtVI);
                return (
                    <Card key={index}>
                        <CardItem header bordered>
                            <Text>{data.TenDoiTuong}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>Nội dung: {data.NoiDung}</Text>
                                <Text>Người tạo: {data.NguoiTao}</Text>
                                <Text>Ngày CN: {NgayCN}</Text>
                                <Text style={Styles.ctcv_trangthai}>Trạng thái: {data.TenTrangThai}</Text>
                            </Body>
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
                    <Text style={Styles.lbError}>{ErrorMessage.ERROR_KHONGCOTAILIEU}</Text>
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
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_CongViecGetBaoCaoTuan';
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
