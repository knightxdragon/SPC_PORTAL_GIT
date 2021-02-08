import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import moment from 'moment';
import lodash from 'lodash';

import APICall from '../../../../class/APICall';
import Config from '../../../../class/Config';
import { CurrentDate } from '../../../../components/CurrentDate';
import ErrorMessage from '../../../../class/ErrorMessage';
import ModalLogin from '../../../../components/ModalLogin';
import MyActivityIndicator from '../../../../components/MyActivityIndicator';
import Styles from '../../../Styles';
import TextMessage from '../../../../class/TextMessage';

import { Layout } from '@ui-kitten/components';

import TemplateGroupDuyet from '../TemplateGroupDuyet';

const fmtVI = 'DD-MM-YYYY';
var saveDate = null;

export default class TabChuaDuyet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getNavigation: this.props.parNavigation,
            getParentDate: this.props.parDate, // lấy tham số ngày từ component cha
            getRef: this.props.parRef, // lấy tham số ref từ component cha
            getParentUserId: this.props.parUserId,
            dataSource: [], // lưu trữ dữ liệu json
            loading: true,
            expanded: true,
            visible: false
        }
    }

    conditionRender() {
        let dataS = this.state.dataSource;
        let userId = this.state.getParentUserId;
        let navigation = this.state.getNavigation;

        if (dataS != null && dataS.length > 0) {
            let list = dataS.map((newJson, key) => {
                let convertDate = moment(newJson.nKey, fmtVI).toDate();
                let displayDate = CurrentDate(moment(convertDate), false);

                return (
                    <Layout key={key} style={Styles.flexFull}>
                        <TemplateGroupDuyet key={key} parDisplayDate={displayDate} parNewJson={newJson} parUserID={userId} parType={1} tabNavigation={navigation} parDuyet={true} />
                    </Layout>
                )
            })

            return list;
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

        if (nextProps.parRef !== prevState.getRef) {
            return {
                getRef: nextProps.parRef
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
                saveDate = this.state.getParentDate;
                this.fetchData(this.state.getParentDate);
            })
        }

        if (prevState.getRef != this.state.getRef) {
            if (this.state.getRef == 0) {
                setTimeout(() => {
                    this.setState({
                        dataSource: [],
                        loading: true
                    }, () => {
                        this.fetchData(this.state.getParentDate);
                    })
                }, 1000)
            }
        }
    }

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        this.fetchData(null);

        this.focusListener = this.state.getNavigation.addListener('focus', () => {
            this.setState({
                loading: true
            }, () => {
                this.fetchData(saveDate)
            })
        });
    }

    fetchData(valueDate) {
        const realDate = valueDate != null ? valueDate : this.state.getParentDate;
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanNgayChuaDuyet';
        var data = {
            Ngay: realDate,
            //UserId: this.state.getParentUserId
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
                let newJson = [];
                responseAsJson.map((item, index) => {
                    let batDau = moment(item.BatDau).format('DD-MM-YYYY');
                    item['GroupBatDau'] = batDau;
                    newJson.push(item);
                });

                let newData = lodash.chain(newJson)
                    .groupBy("GroupBatDau")
                    .map((value, key) => ({ nKey: key, nValue: value }))
                    .value();

                this.setState({
                    dataSource: newData,
                    loading: false
                });
            }
        })
    }
}
