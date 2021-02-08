
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import APICall from '../../../class/APICall';
import Config from '../../../class/Config';
import ErrorMessage from '../../../class/ErrorMessage';
import ModalLogin from '../../../components/ModalLogin';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Session from '../../../components/Session';
import Styles from '../../Styles';
import TextMessage from '../../../class/TextMessage';

import {
    Layout,
    Text
} from '@ui-kitten/components';

import TemplateChiTietPhienHop from './TemplateChiTietPhienHop';

export default function (props) {
    const route = useRoute();
    const navigation = useNavigation();

    return <ChiTietPhienHopScreen {...props} route={route} navigation={navigation} />;
}

class ChiTietPhienHopScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            dataSource: [],
            maduan: null,
            loading: true,
            trangThai: null,
            vaitro: null,
            visible: false
        }
    }

    conditionRender() {
        if (this.state.dataSource.length > 0) {
            return this.state.dataSource.map((item, key) => (
                <TemplateChiTietPhienHop key={key} parItem={item} parVaiTro={this.state.vaitro} parNavigation={this.props.navigation} />
            ))
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOLICH);
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <Layout style={Styles.flexFull}>
                    <ScrollView>
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

    fetchData() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_GetCongViecByDuAn';
        var data = {
            UserId: this.state.userID,
            MaDuAn: this.state.maduan,
            TrangThai: this.state.trangThai,
            VaiTro: this.state.vaitro,
            IDDoiTuong: ''
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
                });
            }
        })
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.props.navigation.removeListener();
    }

    componentDidMount() {
        const { route } = this.props;
        const { navigation } = this.props;

        this.focusListener = navigation.addListener('focus', () => {
            this.setState({
                loading: true
            }, () => {
                const valuedID = route.params.MaDuAn;
                const valuedTrangThai = route.params.TrangThai;
                const valuedVaiTro = route.params.VaiTro;

                Session.getUserInfo().then((goals) => {
                    this.setState({
                        userID: goals.UserId,
                        maduan: valuedID,
                        trangThai: valuedTrangThai,
                        vaitro: valuedVaiTro
                    }, () => {
                        this.fetchData();
                    })
                });
            })
        });
    }
}
