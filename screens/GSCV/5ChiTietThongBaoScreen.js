
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View, Container, Content, Card } from 'native-base';
import Styles from '../Styles';
import MyActivityIndicator from '../../components/MyActivityIndicator';
import Config from '../../class/Config';
import ErrorMessage from '../../class/ErrorMessage';
import Session from '../../components/Session';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { withNavigation } from 'react-navigation';
import TabChiTietAll_GSCV from './6TabChiTietAll_GSCV';

export default class ChiTietThongBaoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            dataSource: [],
            maduan: null,
            loading: true,
            trangThai: null
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const valuedID = navigation.getParam('MaDuAn');
        const valuedTrangThai = navigation.getParam('TrangThai');

        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId,
                maduan: valuedID,
                trangThai: valuedTrangThai
            })
            this.fetchData();
        });
    }

    conditionRender() {
        if (this.state.dataSource.length > 0) {
            return this.state.dataSource.map((item, key) => (
                <TabChiTietAll_GSCV key={key} parItem={item} />
            ))
        }
        else {
            return <Text style={Styles.lbError}>{ErrorMessage.ERROR_GIAMSATCONGVIEC}</Text>
        }
    }

    fetchData() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_GetCongViecByDuAn';
        var data = {
            UserId: this.state.userID,
            MaDuAn: this.state.maduan,
            TrangThai: this.state.trangThai
        };

        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
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

    render() {
        if (!this.state.loading) {
            return (
                <Container>
                    <Content>
                        {this.conditionRender()}
                    </Content>
                </Container>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }
}
