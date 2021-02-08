import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import APICall from "../../../class/APICall";
import Config from '../../../class/Config';
import ErrorMessage from '../../../class/ErrorMessage';
import ModalLogin from '../../../components/ModalLogin';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Session from '../../../components/Session';
import Styles from '../../Styles';

import TextMessage from '../../../class/TextMessage';
import {
    Layout,
    CheckBox,
    Card,
    Button
} from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';

var idUser = null;
var idVaiTro = null;
var idMaCongViec = null;
var phongBanCTTempCheckValues = [];
var phongBanCTArrayChecked = [];
var phongBanTempCheckValues = [];
var phongBanArrayChecked = [];
var nhanVienCTTempCheckValues = [];
var nhanVienCTArrayChecked = [];
var nhanVienTempCheckValues = [];
var nhanVienArrayChecked = [];
const widthConst = 50;
const hori = 10;

function Done(navigation) {
    var arrayDT = new Array();
    var arrayDTCT = new Array();
    var action = '';

    if (idVaiTro == 'TSK_LDAO' || idVaiTro == 'TSK_TKY') {
        arrayDT = Array.from(new Set(phongBanArrayChecked));
        arrayDTCT = Array.from(new Set(phongBanCTArrayChecked));
        action = 'GS_PhongBanTH_Insert';
    }
    else {
        arrayDT = Array.from(new Set(nhanVienArrayChecked));
        arrayDTCT = Array.from(new Set(nhanVienCTArrayChecked));
        action = 'GS_NhanVienTH_Insert';
    }

    var url = Config.BASE_URL + Config.API_GSCV + action;
    var data = {
        UserId: idUser,
        MaCongViec: idMaCongViec,
        SelectedDoiTuong: arrayDT.toString(),
        SelectedDoiTuongChuTri: arrayDTCT.toString()
    };

    APICall.callPostData(url, data).then((responseAsJson) => {
        if (JSON.stringify(responseAsJson) == '""') {
            Alert.alert(
                'Thông báo',
                'Phân công thành công',
                [
                    {
                        text: 'OK', onPress: () => {
                            navigation.goBack();
                        }
                    },
                ],
                { cancelable: false },
            );
        }
    })
}

export default function (props) {
    const route = useRoute();
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Phân công',
            headerRight: () => (
                <Button appearance='ghost' status='success' onPress={() => Done(navigation)} style={{ paddingRight: 10 }}>
                    Lưu
                </Button>
            )
        });
    }, [navigation]);

    return <PhanCongCongViecScreen {...props} route={route} navigation={navigation} />;
}

class PhanCongCongViecScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: null,
            selectedMaCongViec: null,
            selectedTenCongViec: null,
            selectedVaiTro: null,

            phongBanCTChecked: [],
            phongBanChecked: [],
            phongBanDataSource: [],
            phongBanLoading: true,

            nhanVienCTChecked: [],
            nhanVienChecked: [],
            nhanVienDataSource: [],
            nhanVienLoading: true,
            visible: false
        }
    }

    render() {
        return (
            <Layout style={Styles.flexFull}>
                <Layout style={Styles.lt_time}>
                    <Card>
                        <Text>{this.state.selectedTenCongViec}</Text>
                    </Card>
                </Layout>
                <Layout style={Styles.flexFullContent}>
                    <ScrollView>
                        <Layout style={Styles.lt_time}>
                            <Layout style={Styles.flexDirectionRow}>
                                <Layout style={{ minWidth: widthConst, marginHorizontal: hori }}>
                                    <Text>Chủ trì</Text>
                                </Layout>
                                <Layout style={{ minWidth: widthConst, marginHorizontal: hori }}>
                                    <Text>Phối hợp</Text>
                                </Layout>
                                <Layout>
                                    <Text>Tên</Text>
                                </Layout>
                            </Layout>
                        </Layout>
                        <Layout style={Styles.lt_time}>
                            {this.renderThucHien()}
                        </Layout>
                    </ScrollView>
                    <ModalLogin visible={this.state.visible} />
                </Layout>
            </Layout>
        )
    }

    //#region Thực hiện
    fetchDataPhongBanThucHien() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_PhongBanTH_Select';
        var data = {
            UserId: this.state.userID,
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
                    phongBanDataSource: result,
                    phongBanLoading: false
                });
            }
        })
    }

    fetchDataNhanVienThucHien() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_NhanVienTH_Select';
        var data = {
            UserId: this.state.userID,
            MaCongViec: this.state.selectedMaCongViec
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
                responseAsJson.filter(function (item) {
                    return item.XuLyChinh == 1;
                }).map(function ({ UserID }) {
                    nhanVienCTArrayChecked.push(UserID)
                });

                this.setState({
                    nhanVienDataSource: responseAsJson,
                    nhanVienLoading: false
                });
            }
        })
    }

    renderPhongBanThucHien() {
        if (!this.state.phongBanLoading) {
            if (this.state.phongBanDataSource.length > 0) {
                const list = this.state.phongBanDataSource.map((itemSource, keySource) => {
                    var setCheckCT = false;
                    var setCheck = false;

                    // Chủ trì
                    if (phongBanCTArrayChecked.length > 0) {
                        if (phongBanCTArrayChecked[0] == itemSource.UserID) {
                            setCheckCT = true
                            this.state.phongBanCTChecked[itemSource.UserID] = true
                        }
                        else {
                            setCheckCT = false
                            this.state.phongBanCTChecked[itemSource.UserID] = false
                        }
                    }

                    // Phối hợp
                    if (this.state.phongBanChecked[itemSource.UserID] != undefined) { // Lần thứ 2
                        setCheck = this.state.phongBanChecked[itemSource.UserID]
                    }
                    else { // Lần đầu tiên
                        if (itemSource.XuLy != 0) {
                            setCheck = true
                            this.state.phongBanChecked[itemSource.UserID] = true;
                        }
                        else {
                            setCheck = false;
                            this.state.phongBanChecked[itemSource.UserID] = false;
                        }
                    }

                    return (
                        <Layout style={Styles.lt_time} key={keySource}>
                            <Layout style={Styles.flexDirectionRow}>
                                <Layout style={{ minWidth: widthConst, marginHorizontal: hori }}>
                                    <CheckBox
                                        checked={setCheckCT}
                                        onChange={() => this.changePBCT(itemSource.MaPhong, this.state.phongBanCTChecked[itemSource.MaPhong])}
                                    />
                                </Layout>
                                <Layout style={{ minWidth: widthConst, marginHorizontal: hori + 5 }}>
                                    <CheckBox
                                        checked={setCheck}
                                        onChange={() => this.changePB(itemSource.MaPhong, this.state.phongBanChecked[itemSource.MaPhong])}
                                    />
                                </Layout>
                                <Layout>
                                    <Text>{itemSource.TenPhong}</Text>
                                </Layout>
                            </Layout>
                        </Layout>
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_DSTHUCHIEN);
            }
        }
        else {
            return <MyActivityIndicator />
        }
    }

    renderNhanVienThucHien() {
        if (!this.state.nhanVienLoading) {
            if (this.state.nhanVienDataSource.length > 0) {
                const list = this.state.nhanVienDataSource.map((itemSource, keySource) => {
                    var setCheckCT = false; // biến chủ trì
                    var setCheck = false; // biến phối hợp

                    // Chủ trì
                    if (nhanVienCTArrayChecked.length > 0) {
                        if (nhanVienCTArrayChecked[0] == itemSource.UserID) {
                            setCheckCT = true
                            this.state.nhanVienCTChecked[itemSource.UserID] = true
                        }
                        else {
                            setCheckCT = false
                            this.state.nhanVienCTChecked[itemSource.UserID] = false
                        }
                    }

                    // Phối hợp
                    if (this.state.nhanVienChecked[itemSource.UserID] != undefined) { // Lần thứ 2
                        setCheck = this.state.nhanVienChecked[itemSource.UserID]
                    }
                    else { // Lần đầu tiên
                        if (itemSource.XuLy != 0) {
                            setCheck = true
                            this.state.nhanVienChecked[itemSource.UserID] = true;
                        }
                        else {
                            setCheck = false;
                            this.state.nhanVienChecked[itemSource.UserID] = false;
                        }
                    }

                    return (
                        <Layout style={Styles.lt_time} key={keySource}>
                            <Layout style={Styles.flexDirectionRow}>
                                <Layout style={{ minWidth: widthConst, marginHorizontal: hori }}>
                                    <CheckBox
                                        checked={setCheckCT}
                                        onChange={() => this.changeNVCT(itemSource.UserID, this.state.nhanVienCTChecked[itemSource.UserID])}
                                    />
                                </Layout>
                                <Layout style={{ minWidth: widthConst, marginHorizontal: hori + 5 }}>
                                    <CheckBox
                                        checked={setCheck}
                                        onChange={() => this.changeNV(itemSource.UserID, this.state.nhanVienChecked[itemSource.UserID])}
                                    />
                                </Layout>
                                <Layout>
                                    <Text>{itemSource.TenHienThi}</Text>
                                </Layout>
                            </Layout>
                        </Layout>
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_DSTHUCHIEN);
            }
        }
        else {
            return <MyActivityIndicator />
        }
    }

    loadThucHien() {
        if (this.state.selectedVaiTro == 'TSK_LDAO' || this.state.selectedVaiTro == 'TSK_TKY') {
            this.fetchDataPhongBanThucHien()
        }
        else {
            this.fetchDataNhanVienThucHien()
        }
    }

    renderThucHien() {
        if (this.state.selectedVaiTro == 'TSK_LDAO' || this.state.selectedVaiTro == 'TSK_TKY') {
            return this.renderPhongBanThucHien()
        }
        else {
            return this.renderNhanVienThucHien()
        }
    }

    changePBCT(id, value) {
        phongBanCTArrayChecked = new Array();

        this.setState({
            phongBanCTChecked: phongBanCTTempCheckValues
        })

        var tempCheckBoxChecked = this.state.phongBanCTChecked;
        tempCheckBoxChecked[id] = !value;

        this.setState({
            phongBanCTChecked: tempCheckBoxChecked
        })

        if (this.state.phongBanCTChecked[id]) {
            phongBanCTArrayChecked.push(id)
            this.changePB(id, false)
        }
    }

    changePB(id, value) {
        if (id != phongBanCTArrayChecked[0]) {
            value = !value
        }

        this.setState({
            phongBanChecked: phongBanTempCheckValues
        })

        var tempCheckBoxChecked = this.state.phongBanChecked;
        tempCheckBoxChecked[id] = value;

        this.setState({
            phongBanChecked: tempCheckBoxChecked
        })

        if (this.state.phongBanChecked[id]) {
            phongBanArrayChecked.push(id)
        }
        else {
            phongBanArrayChecked = phongBanArrayChecked.filter(item => item != id);
        }
    }

    changeNVCT(id, value) {
        nhanVienCTArrayChecked = new Array();

        this.setState({
            nhanVienCTChecked: nhanVienCTTempCheckValues
        })

        var tempCheckBoxChecked = this.state.nhanVienCTChecked;
        tempCheckBoxChecked[id] = !value;

        this.setState({
            nhanVienCTChecked: tempCheckBoxChecked
        })

        if (this.state.nhanVienCTChecked[id]) {
            nhanVienCTArrayChecked.push(id)
            this.changeNV(id, false)
        }
    }

    changeNV(id, value) {
        if (id != nhanVienCTArrayChecked[0]) {
            value = !value
        }

        this.setState({
            nhanVienChecked: nhanVienTempCheckValues
        })

        var tempCheckBoxChecked = this.state.nhanVienChecked;
        tempCheckBoxChecked[id] = value;

        this.setState({
            nhanVienChecked: tempCheckBoxChecked
        })

        if (this.state.nhanVienChecked[id]) {
            nhanVienArrayChecked.push(id)
        }
        else {
            nhanVienArrayChecked = nhanVienArrayChecked.filter(item => item != id);
        }
    }
    //#endregion

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        const { route } = this.props;
        const valuedVaitro = route.params.VaiTro;
        const valuedMaCongViec = route.params.MaCongViec;
        const valuedTenCongViec = route.params.TenCongViec;

        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId,
                selectedMaCongViec: valuedMaCongViec,
                selectedTenCongViec: valuedTenCongViec,
                selectedVaiTro: valuedVaitro
            }, () => {
                idUser = this.state.userID;
                idVaiTro = this.state.selectedVaiTro;
                idMaCongViec = this.state.selectedMaCongViec;
                this.loadThucHien();
            })
        });
    }
}