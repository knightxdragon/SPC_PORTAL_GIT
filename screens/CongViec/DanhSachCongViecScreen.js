import React, { Component } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, Modal, TouchableOpacity, Dimensions, View } from 'react-native';
import moment from 'moment';

import APICall from '../../class/APICall';
import Config from '../../class/Config';
import ErrorMessage from '../../class/ErrorMessage';
import * as IK from '../../components/IconKitten';
import ModalLogin from '../../components/ModalLogin';
import MyActivityIndicator from '../../components/MyActivityIndicator';
import Session from '../../components/Session';
import Styles from '../Styles';
import TextMessage from '../../class/TextMessage';

import {
    Card,
    Layout,
    Text,
    Button,
    CheckBox,
    Radio,
    Select
} from '@ui-kitten/components';

const widthTitle = 100
const heightThucHien = 400
const sizeIcon = 16
var phongBanTempCheckValues = [];
var phongBanArrayChecked = [];
var nhanVienTempCheckValues = [];
var nhanVienArrayChecked = [];
var chuTriTempCheckValues = [];
var chuTriArrayChecked = [];
var chuTriArrayCheckedDefault = [];
var prevStateTrangThai = -1; // giữ giá trị vừa lưu trước đó của radio trạng thái

export default function (props) {
    const route = useRoute();
    const navigation = useNavigation();

    return <DanhSachCongViecScreen {...props} route={route} navigation={navigation} />;
}

class DanhSachCongViecScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curDate: moment(),
            userID: null,
            visible: false,

            loadingLoaiDA: true,
            loadingVaiTro: true,
            loadingBoLoc: true,
            loadingKetQua: true,
            dataSourceKetQua: [],

            selectedLoaiDA: null,
            selectedValueLoaiDA: null,
            dataSourceLoaiDA: [],

            selectedVaiTro: null,
            selectedValueVaiTro: null,
            dataSourceVaiTro: [],

            boLocVisible: false,

            phongBanChecked: [],
            phongBanDataSource: [],
            phongBanLoading: true,

            nhanVienChecked: [],
            nhanVienDataSource: [],
            nhanVienLoading: true,

            chuTriChecked: [],
            chuTriDataSource: [],
            chuTriLoading: true,

            // trạng thái
            trangThaiVisible: false,
            trangThaiDataSource: [],
            trangThaiLoading: true,
            trangThaiRad: null,
            trangThaiTextRad: '',
            trangThaiTextRefresh: '',
            //---
        }
    }

    renderCardHeader(value) {
        return (
            <View>
                <Text style={Styles.cardHeader}>{value}</Text>
            </View>
        )
    }

    render() {
        return (
            <Layout style={Styles.flexFull}>
                <Layout>
                    <Card>
                        <Layout style={Styles.flexDirectionColumn}>
                            <Layout style={Styles.lt_time}>
                                <Button appearance='outline' icon={IK.Funnel} onPress={() => this.setModalBoLocVisible()}>
                                    Bộ lọc danh sách kết qủa
                                </Button>
                            </Layout>
                            <Layout style={Styles.flexDirectionRow}>
                                <Layout style={Styles.justifyCenter}>
                                    <Text style={{ width: widthTitle }}>Loại VB</Text>
                                </Layout>
                                <Layout style={Styles.flexFull}>
                                    {this.renderLoaiDuAn()}
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_bottom}>
                                <Layout style={Styles.justifyCenter}>
                                    <Text style={{ width: widthTitle }}>Vai trò</Text>
                                </Layout>
                                <Layout style={Styles.flexFull}>
                                    {this.renderVaiTro()}
                                </Layout>
                            </Layout>
                        </Layout>
                    </Card>
                </Layout>
                <Layout style={Styles.flexFullContent}>
                    <ScrollView>
                        {this.showResult()}
                        {this.renderKetQua()}
                    </ScrollView>
                </Layout>
                <Layout style={Styles.lt_time}>
                    <Layout style={Styles.flexDirectionRow}>
                        <Layout style={Styles.lt_button_group}>
                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={this.state.boLocVisible}
                            >
                                <Layout style={Styles.flexModal}>
                                    <Layout style={Styles.lt_time}>
                                        <Layout style={Styles.flexDirectionRow}>
                                            <Layout style={Styles.flexFull}>
                                                <Button appearance='ghost' icon={IK.ArrowBack} status='basic' onPress={() => { this.setModalBoLocInVisible() }}>
                                                    Quay lại
                                                </Button>
                                            </Layout>
                                            <Layout style={{ flex: 1, justifyContent: 'center' }}>
                                                <Text category='h6' style={{ textAlign: 'center' }}>BỘ LỌC</Text>
                                            </Layout>
                                            <Layout style={Styles.flexFull}>
                                                <Button appearance='ghost' status='success' onPress={() => this.implementBoLoc()}>
                                                    Xong
                                                </Button>
                                            </Layout>
                                        </Layout>
                                    </Layout>
                                    <Layout style={Styles.flexFull}>
                                        <ScrollView>
                                            <Layout style={Styles.lt_time}>
                                                <Card header={() => this.renderCardHeader('Trạng thái')}>
                                                    {this.renderTrangThai()}
                                                </Card>
                                            </Layout>
                                            <Layout style={Styles.lt_time}>
                                                <Card header={() => this.renderCardHeader('Chủ trì')}>
                                                    {this.renderChuTri()}
                                                </Card>
                                            </Layout>
                                            <Layout style={Styles.lt_time}>
                                                <Card header={() => this.renderCardHeader('Thực hiện')}>
                                                    {this.renderThucHien()}
                                                </Card>
                                            </Layout>
                                            <Layout style={Styles.lt_time}>
                                                <Button appearance='outline' status='success' onPress={() => this.implementBoLoc()}>
                                                    Xong
                                                </Button>
                                            </Layout>
                                        </ScrollView>
                                    </Layout>
                                </Layout>
                            </Modal>
                        </Layout>
                    </Layout>
                </Layout>
                <ModalLogin visible={this.state.visible} />
            </Layout>

        )
    }

    //#region Trạng thái
    fetchDataTrangThai() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_DmTrangThai_Select';
        var data = {
            UserId: this.state.userID
        }

        return APICall.callPostData(url, data);
    }

    renderTrangThai() {
        if (!this.state.trangThaiLoading) {
            if (this.state.trangThaiDataSource.length > 0) {
                const list = this.state.trangThaiDataSource.map((itemSource, keySource) => {
                    var setCheck = false; // biến dùng để thiết lập true/false selected
                    var textTrangThai = ''

                    if (
                        this.state.trangThaiRad == null &&
                        itemSource.StatusID == prevStateTrangThai &&
                        prevStateTrangThai != -1
                    ) {
                        setCheck = true;
                    }
                    else {
                        if (this.state.trangThaiRad == itemSource.StatusID) {
                            setCheck = true
                        }
                    }

                    textTrangThai += itemSource.Title

                    return (
                        <Radio key={keySource}
                            checked={setCheck}
                            style={Styles.grid}
                            text={textTrangThai}
                            onChange={() => {
                                this.setState({ trangThaiRad: itemSource.StatusID, trangThaiTextRad: textTrangThai })
                            }}
                        >
                        </Radio>
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_COMBOBOX_TRANGTHAI);
            }
        }
        else {
            return <MyActivityIndicator />
        }
    }
    //#endregion

    //#region Thực hiện
    fetchDataPhongBanThucHien() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_PhongBanTH_Select';
        var data = {
            UserId: this.state.userID,
        };

        return APICall.callPostData(url, data);
    }

    fetchDataNhanVienThucHien() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_NhanVienTH_Select';
        var data = {
            UserId: this.state.userID,
        };

        return APICall.callPostData(url, data);
    }

    renderPhongBanThucHien() {
        if (!this.state.phongBanLoading) {
            if (this.state.phongBanDataSource.length > 0) {
                const list = this.state.phongBanDataSource.map((itemSource, keySource) => {
                    var setCheck = false;

                    if (this.state.phongBanChecked[itemSource.MaPhong] != undefined) {
                        setCheck = this.state.phongBanChecked[itemSource.MaPhong]
                    }

                    return (
                        <CheckBox key={keySource} checked={setCheck} style={Styles.grid}
                            text={itemSource.TenPhong}
                            onChange={() => {
                                this.changePB(itemSource.MaPhong, this.state.phongBanChecked[itemSource.MaPhong])
                            }}>
                        </CheckBox>
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
                    var setCheck = false;

                    if (this.state.nhanVienChecked[itemSource.UserID] != undefined) {
                        setCheck = this.state.nhanVienChecked[itemSource.UserID]
                    }

                    return (
                        <CheckBox key={keySource} checked={setCheck} style={Styles.grid}
                            text={itemSource.TenHienThi}
                            onChange={() => {
                                this.changeNV(itemSource.UserID, this.state.nhanVienChecked[itemSource.UserID])
                            }}>
                        </CheckBox>
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
            this.fetchDataPhongBanThucHien().then((result) => {
                this.setState({
                    phongBanDataSource: result,
                    phongBanLoading: false
                }, () => {
                    this.fetchDataKetQua();
                });
            })
        }
        else {
            this.fetchDataNhanVienThucHien().then((result) => {
                this.setState({
                    nhanVienDataSource: result,
                    nhanVienLoading: false
                }, () => {
                    this.fetchDataKetQua();
                });
            })
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

    changePB(id, value) {
        this.setState({
            phongBanChecked: phongBanTempCheckValues
        })

        var tempCheckBoxChecked = this.state.phongBanChecked;
        tempCheckBoxChecked[id] = !value;

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

    changeNV(id, value) {
        this.setState({
            nhanVienChecked: nhanVienTempCheckValues
        })

        var tempCheckBoxChecked = this.state.nhanVienChecked;
        tempCheckBoxChecked[id] = !value;

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

    //#region Chủ trì
    fetchDataChuTriThucHien() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_ChuTri_Select';
        var data = {
            UserId: this.state.userID,
            VaiTro: this.state.selectedVaiTro
        };

        return APICall.callPostData(url, data);
    }

    renderChuTri() {
        if (!this.state.chuTriLoading) {
            if (this.state.chuTriDataSource.length > 0) {
                const list = this.state.chuTriDataSource.map((itemSource, keySource) => {
                    var setCheck = false; // biến dùng để thiết lập true/false selected
                    var stateCheck = -1;

                    if (this.state.chuTriChecked[itemSource.IdChuTri] == undefined && chuTriArrayCheckedDefault.length > 0) {
                        if (chuTriArrayCheckedDefault.indexOf(itemSource.IdChuTri.toString()) > -1) { // true
                            setCheck = true
                            stateCheck = 1
                        }
                    }
                    else {
                        if (chuTriArrayCheckedDefault.indexOf(itemSource.IdChuTri.toString()) > -1) { // true
                            setCheck = !this.state.chuTriChecked[itemSource.IdChuTri]
                            this.state.chuTriChecked[itemSource.IdChuTri] = false
                            chuTriArrayCheckedDefault = chuTriArrayCheckedDefault.filter(item => item != itemSource.IdChuTri)
                            stateCheck = 1
                        }
                        else {
                            setCheck = this.state.chuTriChecked[itemSource.IdChuTri]
                            stateCheck = 0
                        }
                    }

                    return (
                        <CheckBox key={keySource} checked={setCheck} style={Styles.grid}
                            text={itemSource.TenChuTri}
                            onChange={() => {
                                this.changeCT(itemSource.IdChuTri, this.state.chuTriChecked[itemSource.IdChuTri], stateCheck)
                            }}>
                        </CheckBox>
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_COMBOBOX_CHUTRI);
            }
        }
        else {
            return <MyActivityIndicator />
        }
    }

    changeCT(id, value, stateS) {
        this.setState({
            chuTriChecked: chuTriTempCheckValues
        })

        var tempCheckBoxChecked = this.state.chuTriChecked;
        tempCheckBoxChecked[id] = !value;

        this.setState({
            chuTriChecked: tempCheckBoxChecked
        })

        if ((this.state.chuTriChecked[id] == true && stateS == 0) ||
            (this.state.chuTriChecked[id] == false && stateS == 1)) {
            chuTriArrayChecked.push(id);
        }

        if ((this.state.chuTriChecked[id] == false && stateS == 0) ||
            (this.state.chuTriChecked[id] == true && stateS == 1)) {
            chuTriArrayChecked = chuTriArrayChecked.filter(item => item != id);
        }
    }
    //#endregion

    //#region Bộ lọc
    implementBoLoc() {
        this.setState({
            loadingKetQua: true
        })
        this.fetchDataKetQua()
        this.setModalBoLocInVisible();
    }

    setModalBoLocVisible = () => {
        this.setState({
            boLocVisible: true
        })
    }

    setModalBoLocInVisible() {
        this.setState({
            boLocVisible: false
        })
    }
    //#endregion

    //#region Kết quả
    fetchDataKetQua() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_GetDanhSachDuAn';
        var thuchien = null;
        var chuTri = Array.from(new Set(chuTriArrayChecked));

        if (this.state.selectedVaiTro == 'TSK_LDAO' || this.state.selectedVaiTro == 'TSK_TKY') {
            thuchien = Array.from(new Set(phongBanArrayChecked));
        }
        else {
            thuchien = Array.from(new Set(nhanVienArrayChecked));
        }

        var data = {
            UserId: this.state.userID,
            IdDoiTuong: thuchien.toString(),
            LoaiDuAn: this.state.selectedLoaiDA,
            TrangThai: this.state.trangThaiRad,
            ChuTri: chuTri.toString(),
            VaiTro: this.state.selectedVaiTro,
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            this.setState({
                dataSourceKetQua: responseAsJson,
                loadingKetQua: false
            })
        })
    }

    fetchDataKetQuaDefault() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_GiaTri_Select';
        var data = {
            UserId: this.state.userID,
            IdDoiTuong: this.state.selectedDoiTuong,
            LoaiDuAn: this.state.selectedLoaiDA,
            VaiTro: this.state.selectedVaiTro,
        };

        return APICall.callPostData(url, data);
    }

    showResult() {
        if (!this.state.loadingKetQua) {
            let count = this.state.dataSourceKetQua.length

            if (count > 0) {
                return (
                    <Layout style={Styles.thtml_detailContent}>
                        <Text>
                            Tìm thấy <Text category='h6' status='info'>{count}</Text> kết quả
                        </Text>
                    </Layout>
                )
            }
        }
    }

    renderKetQua() {
        const { navigation } = this.props;

        if (!this.state.loadingKetQua) {
            if (this.state.dataSourceKetQua.length > 0) {
                const list = this.state.dataSourceKetQua.map((itemSource, keySource) => {
                    return (
                        <TouchableOpacity key={keySource} onPress={() => {
                            navigation.navigate('ChiTietPhienHop', { MaDuAn: itemSource.MaDuAn, TrangThai: this.state.trangThaiRad, VaiTro: this.state.selectedVaiTro })
                        }}>
                            <Layout style={Styles.thtml_detailContent}>
                                <Layout style={Styles.lt_time}>
                                    <Text style={Styles.dscv_title_item}>{itemSource.TenDuAn}</Text>
                                </Layout>
                                <Layout style={Styles.lt_time}>
                                    <Text>
                                        Đang xử lý: <Text category='s1'>{itemSource.ChuaGQ}</Text> -
                                        Quá hạn: <Text category='s1' status='danger'>{itemSource.QuaHan}</Text> -
                                        Đã xử lý: <Text category='s1' status='success'>{itemSource.DaGQ}</Text>
                                    </Text>
                                </Layout>
                            </Layout>
                        </TouchableOpacity>
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_GIAMSATCONGVIEC);
            }
        }
        else {
            return <MyActivityIndicator />
        }
    }
    //#endregion

    //#region Loại dự án
    changeLoaiDA(value) {
        this.setState({
            selectedLoaiDA: value
        }, () => {
            this.fetchDataKetQua()
        });
    }

    fetchDataLoaiDA() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_DmLoaiDA_Select';

        return APICall.callPostNoData(url);
    }

    renderLoaiDuAn() {
        if (this.state.dataSourceLoaiDA.length > 0) {
            return (
                <Select
                    placeholder={'Chọn loại dự án'}
                    data={this.state.dataSourceLoaiDA}
                    selectedOption={this.state.selectedValueLoaiDA}
                    onSelect={(value) => {
                        this.setState({
                            selectedValueLoaiDA: value,
                            selectedLoaiDA: value.id
                        }, () => {
                            this.changeLoaiDA(value.id)
                        })
                    }}
                />
            )
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_COMBOBOX_LOAIDUAN);
        }
    }
    //#endregion

    //#region Vai trò
    changeVaiTro(value) {
        this.setState({
            selectedVaiTro: value
        }, () => {
            this.fetchDataKetQua()
        });
    }

    fetchDataVaiTro() {
        var url = Config.BASE_URL + Config.API_GSCV + 'GS_VaiTro_Select';
        var data = {
            UserId: this.state.userID
        };

        return APICall.callPostData(url, data);
    }

    renderVaiTro() {
        if (this.state.dataSourceVaiTro.length > 0) {
            return (
                <Select
                    placeholder={'Chọn vai trò'}
                    data={this.state.dataSourceVaiTro}
                    selectedOption={this.state.selectedValueVaiTro}
                    onSelect={(value) => {
                        this.setState({
                            selectedValueVaiTro: value,
                            selectedVaiTro: value.id
                        }, () => {
                            this.changeVaiTro(value.id)
                        })
                    }}
                />
            )
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_COMBOBOX_VAITRO);
        }
    }
    //#endregion

    callFetchData(parIdDoiTuong, parLoaiDuAn, parVaiTro) {
        this.setState({
            selectedDoiTuong: parIdDoiTuong,
            selectedLoaiDA: parLoaiDuAn.id,
            selectedVaiTro: parVaiTro.id,
            selectedValueLoaiDA: parLoaiDuAn,
            selectedValueVaiTro: parVaiTro
        }, () => {
            this.callDataLoaiDA();
        })
    }

    callDataLoaiDA() {
        this.fetchDataLoaiDA().then((result) => {
            if (typeof result.status !== 'undefined') {
                if (responseAsJson.status === 401) { // Invalid token
                    this.setState({
                        visible: true,
                        loading: false
                    })
                }
            }
            else {
                let res = JSON.stringify(result);
                var newArr = [];

                if (typeof res != 'undefined') {
                    Object.values(result).map(function (item) {
                        var dataNew = {
                            id: item.MaLoaiDuAn,
                            text: item.TenLoaiDuAn
                        };
                        newArr.push(dataNew);
                    })
                }

                this.setState({
                    dataSourceLoaiDA: newArr,
                    loadingLoaiDA: false,
                }, () => {
                    this.callDataVaiTro();
                });
            }
        });
    }

    callDataVaiTro() {
        this.fetchDataVaiTro().then((result) => {
            let res = JSON.stringify(result);
            var newArr = [];

            if (typeof res != 'undefined') {
                Object.values(result).map(function (item) {
                    var dataNew = {
                        id: item.FunctionID,
                        text: item.TenVaiTro
                    };
                    newArr.push(dataNew);
                })
            }

            this.setState({
                dataSourceVaiTro: newArr,
                loadingVaiTro: false,
            }, () => {
                this.callDataTrangThai();
            });
        });
    }

    callDataTrangThai() {
        this.fetchDataTrangThai().then((result) => {
            this.setState({
                trangThaiDataSource: result,
                trangThaiLoading: false
            }, () => {
                this.callDataKetQuaDefault();
            });
        });
    }

    callDataKetQuaDefault() {
        this.fetchDataKetQuaDefault().then((result) => {
            if (result.length > 0) {
                this.setState({
                    selectedLoaiDA: result[0].LoaiDuAn,
                    selectedVaiTro: result[0].VaiTro,
                    trangThaiRad: result[0].TrangThai,
                }, () => {
                    this.callDataChuTri();
                })
            }
            else {
                this.callDataChuTri();
            }
        })
    }

    callDataChuTri() {
        this.fetchDataChuTriThucHien().then((result) => {
            this.setState({
                chuTriDataSource: result,
                chuTriLoading: false
            }, () => {
                this.loadThucHien();
            });
        })
    }

    componentDidMount() {
        const { navigation } = this.props;
        const { route } = this.props;
        var parIdDoiTuong = route.params.IdDoiTuong;
        var parLoaiDuAn = route.params.LoaiDuAn;
        var parVaiTro = route.params.VaiTro;

        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId
            }, () => {
                this.callFetchData(parIdDoiTuong, parLoaiDuAn, parVaiTro);
            });
        });
    }
}