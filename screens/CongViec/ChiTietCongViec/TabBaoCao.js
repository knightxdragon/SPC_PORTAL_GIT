import React, { Component } from 'react'
import { ScrollView, Alert } from 'react-native';
import moment from 'moment';

import APICall from '../../../class/APICall';
import Config from '../../../class/Config';
import ErrorMessage from '../../../class/ErrorMessage';
import ModalLogin from '../../../components/ModalLogin';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Session from '../../../components/Session';
import Styles from '../../Styles';
import TextMessage from '../../../class/TextMessage';
import ToastMessage from '../../../class/ToastMessage';

import {
    Layout,
    Button,
    CheckBox,
    Text,
    Input
} from '@ui-kitten/components';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';
const sizeIcon = 34;

export default class TabBaoCao extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getParentMaCongViec: this.props.parMaCongViec, // lấy tham số ngày từ component cha
            getParentLoaiPC: this.props.parLoaiPC, // lấy tham số ngày từ component cha
            userID: null,
            dataSource: [], // lưu trữ dữ liệu json
            loading: true,
            txtBaoCao: null,
            checked: false,
            visible: false
        }
    }

    conditionRender() {
        const item = this.state.dataSource;

        if (item.length > 0) {
            const lapsList = item.map((data, index) => {
                const NgayCN = moment.utc(data.NgayCN, fmtEN).local().format(fmtVI);

                return (
                    <Layout style={Styles.lt_detailContent} key={index}>
                        <Layout style={Styles.flexDirectionRow}>
                            <Layout style={Styles.lt_check}>
                                <CheckBox checked={false} disabled={true} />
                            </Layout>
                            <Layout>
                                <Layout style={Styles.lt_time}>
                                    <Text style={Styles.textPrimary}>{data.TenDoiTuong}</Text>
                                </Layout>
                                <Layout style={Styles.lt_time}>
                                    <Text>Nội dung: <Text style={Styles.textBold}>{data.NoiDung}</Text></Text>
                                </Layout>
                                <Layout style={Styles.lt_time}>
                                    <Text>Người tạo: {data.NguoiTao}</Text>
                                </Layout>
                                <Layout style={Styles.lt_time}>
                                    <Text>Ngày CN: {data.NgayCN != null ? NgayCN : ''}</Text>
                                </Layout>
                                <Layout style={Styles.lt_time}>
                                    <Text>Trạng thái: {data.TenTrangThai}</Text>
                                </Layout>
                            </Layout>
                        </Layout>
                    </Layout>
                )
            })

            return lapsList;
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOBAOCAO);
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <Layout style={Styles.flexFullContent}>
                    <Layout style={Styles.lt_time}>
                        <Layout>
                            <Text>Nhập báo cáo ở đây, đánh dấu check là đã hoàn thành</Text>
                        </Layout>
                        <Layout style={Styles.flexDirectionRow}>
                            <Layout style={{ justifyContent: 'center', marginHorizontal: 5 }}>
                                <CheckBox checked={this.state.checked} onChange={() => this.setState({ checked: !this.state.checked })} />
                            </Layout>
                            <Layout style={Styles.lt_button_group}>
                                <Input placeholder='Nhập thông tin báo cáo' onChangeText={(value) => this.setState({ txtBaoCao: value.trim() })} />
                            </Layout>
                            <Layout>
                                <Button appearance='ghost' status='success' onPress={() => this.implementBaoCao()}>
                                    Lưu
                                </Button>
                            </Layout>
                        </Layout>
                    </Layout>
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

    implementBaoCao() {
        if (this.state.txtBaoCao != '' && this.state.txtBaoCao != null) {
            var flag = false;
            var valueTrangThai = (this.state.checked ? '01DHT' : '00CHT')

            var url = Config.BASE_URL + Config.API_GSCV + 'GS_BaoCao_Insert';
            var data = {
                MaBaoCao: '',
                MaCongViec: this.state.getParentMaCongViec,
                LoaiPC: this.state.getParentLoaiPC,
                NoiDung: this.state.txtBaoCao,
                TrangThai: valueTrangThai,
                UserId: this.state.userID
            };

            if (this.state.checked == false) {
                Alert.alert(
                    //title
                    'Thông báo',
                    //body
                    'Bạn chắc chắn báo cáo ' + this.state.txtBaoCao + ' là không hoàn thành?',
                    [
                        { text: 'Hủy bỏ', onPress: () => { } },
                        {
                            text: 'Xác nhận', onPress: () => {
                                this.fetchDataBaoCao(url, data, this.state.txtBaoCao)
                            }
                        },
                    ],
                    { cancelable: true }
                );
            }
            else {
                this.fetchDataBaoCao(url, data, this.state.txtBaoCao)
            }
        }
        else {
            ToastMessage.showWarning('Chưa nhập báo cáo')
        }
    }

    fetchDataBaoCao(url, data, txtBaoCao) {
        APICall.callPostData(url, data).then((responseAsJson) => {
            if (JSON.stringify(responseAsJson) == '""') {
                Alert.alert(
                    //title
                    'Thông báo',
                    //body
                    'Báo cáo ' + txtBaoCao + ' thành công',
                    [
                        {
                            text: 'Xác nhận', onPress: () => {
                                this.fetchData()
                            }
                        },
                    ],
                    { cancelable: true }
                );
            }
            else {
                alert(JSON.stringify(responseAsJson))
            }
        })
    }

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId
            }, () => {
                this.fetchData();
            })
        });
    }

    fetchData() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_CongViecGetBaoCaoTuan';
        var data = {
            MaCongViec: this.state.getParentMaCongViec,
            UserId: this.state.userID
        };

        APICall.callPostData(url, data).then((result) => {
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
                    dataSource: result,
                    loading: false
                });
            }
        });
    }
}
