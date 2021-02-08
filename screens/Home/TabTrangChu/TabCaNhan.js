import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import APICall from '../../../class/APICall';
import Config from '../../../class/Config';
import ErrorMessage from '../../../class/ErrorMessage';
import ModalLogin from '../../../components/ModalLogin';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Styles from '../../Styles';
import TemplateHTML from '../../LichTuan/TrangChinh/TemplateHTML';
import TextMessage from '../../../class/TextMessage';

import { Layout } from '@ui-kitten/components';

export default class TabCaNhan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getNavigation: this.props.parNavigation,
            getParentDate: this.props.parDate, // lấy tham số ngày từ component cha
            dataSource: [], // lưu trữ dữ liệu json
            getParentUserId: this.props.parUserId,
            loading: true,
            visible: false
        }
    }

    conditionRender() {
        let dataS = this.state.dataSource;

        if (dataS != null) {
            if (dataS.length > 0) {
                return dataS.map((item, key) => (
                    <TemplateHTML key={key} parItem={item} tabNavigation={this.state.getNavigation} />
                ))
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOLICH);
            }
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

    // Khi có sự kiện thay đổi của parent Component thì tham số của thằng con được nhận sẽ thay đổi theo và chỉ render ở lần thứ 2 
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.parDate !== prevState.getParentDate) {
            return {
                getParentDate: nextProps.parDate
            }
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.getParentDate != this.state.getParentDate) {
            this.setState({
                dataSource: [],
                loading: true
            }, () => {
                this.fetchData(this.state.getParentDate);
            })
        }
    }

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        this.props.isMounted = true;
        this.fetchData(null);
    }

    componentWillUnmount() {
        this.props.isMounted = false;
    }

    fetchData(valueDate) {
        const realDate = valueDate != null ? valueDate : this.state.getParentDate;
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanCaNhanNgay';
        var data = {
            Ngay: realDate,
            //UserId: this.state.getParentUserId,
            LoaiLich: ''
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
                if (this.props.isMounted) {
                    this.setState({
                        dataSource: responseAsJson,
                        loading: false
                    });
                }
            }
        })
    }
}
