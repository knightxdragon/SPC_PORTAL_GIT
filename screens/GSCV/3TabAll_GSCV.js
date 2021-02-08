import React, { Component } from 'react';
import { Text, View } from 'react-native';
import ChiTietCV from './4ChiTietCV';
import Styles from '../Styles';
import MyActivityIndicator from '../../components/MyActivityIndicator';
import Config from '../../class/Config';
import ErrorMessage from '../../class/ErrorMessage';
import moment from 'moment';
import Session from '../../components/Session';

const fmtVI = 'DD-MM-YYYY';

export default class TabAll_GSCV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getParentDate: this.props.parDate, // lấy tham số ngày từ component cha
            getIDDT: this.props.parIDDT,
            getType: this.props.parType,
            dataSource: [], // lưu trữ dữ liệu json
            loading: true
        }
    }

    conditionRender() {
        if (this.state.dataSource.length > 0) {
            var list = this.state.dataSource.map((item, key) => {
                return (
                    <ChiTietCV key={key} parItem={item} parTypeCT={this.state.getType} />
                )
            })

            return (
                <View>
                    <Text>
                        Tìm thấy <Text style={Styles.gscv_number}>{this.state.dataSource.length}</Text> kết quả
                    </Text>
                    {list}
                </View>
            )
        }
        else {
            return <Text style={Styles.lbError}>{ErrorMessage.ERROR_GIAMSATCONGVIEC}</Text>
        }
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

    // Khi có sự kiện thay đổi của parent Component thì tham số của thằng con được nhận sẽ thay đổi theo và chỉ render ở lần thứ 2 
    componentWillReceiveProps(nextProps) {
        this.setState({ 
            dataSource: [], 
            loading: true 
        })

        this.fetchData(nextProps.parDate, nextProps.parType);
    }

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        this.fetchData(null);
    }

    fetchData(valueDate, valueType) {
        const realDate = valueDate != null ? valueDate : this.state.getParentDate;
        const standardDate = moment.utc(realDate, fmtVI).local();
        const type = valueType != null ? valueType : this.state.getType;
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_GetDanhSachThangByDuAn';

        Session.getUserInfo().then((goals) => {
            var data = {
                UserId: goals.UserId,
                IdDoiTuong: this.state.getIDDT,
                LoaiDuAn: "MET",
                TrangThai: type,
                Thang: standardDate.month() + 1,
                Nam: standardDate.year()
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
        })
    }
}