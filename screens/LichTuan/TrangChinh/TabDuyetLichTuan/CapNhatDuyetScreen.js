import React, { Component } from 'react';
import { Alert, View, WebView, StyleSheet, Modal, Dimensions } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import { useRoute, useNavigation } from '@react-navigation/native';

import APICall from '../../../../class/APICall';
import Config from '../../../../class/Config';
import ErrorMessage from '../../../../class/ErrorMessage';
import IconZ from '../../../../components/IconZ';
import * as IK from '../../../../components/IconKitten';
import ModalLogin from '../../../../components/ModalLogin';
import MyActivityIndicator from '../../../../components/MyActivityIndicator';
import Session from '../../../../components/Session';
import Styles from '../../../Styles';
import TextMessage from '../../../../class/TextMessage';

import {
    Button,
    CheckBox,
    Layout,
    Text,
    Input,
    Radio
} from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';

const fmtVI = 'DD-MM-YYYY';
const fmtTimeVI = 'DD-MM-YYYY HH:mm';
const fmtFullVI = 'DD-MM-YYYY HH:mm:ss';
const fmtEN = 'YYYY-MM-DD';
const fmtTimeEN = 'YYYY-MM-DD HH:mm';
const fmtFullEN = 'YYYY-MM-DD HH:mm:ss';
const fmtDateTime = 'YYYY-MM-DDTHH:mm:ssZ';
const sizeIcon = 16
var tempCheckValues = [];
var arrayChecked = []; // lưu giá trị check đã chọn trong tab thành phần
var arrayText = [];  // lưu giá trị text đã chọn trong tab thành phần
var arrayCheckedTT = []; // lưu giá trị check đã chọn trong tab trạng thái
var arrayTextTT = [];  // lưu giá trị text đã chọn trong tab trạng thái
var maChuTri = -1; // biến dùng để lưu giá trị mã phòng chủ trì
var maDiaDiem = -1; // biến dùng để lưu giá trị mã phòng địa điểm
var idLich = null;
var userID = null;
var prevStateTrangThai = -1; // giữ giá trị vừa lưu trước đó của radio trạng thái
var prevStateLoaiLich = -1; // giữ giá trị vừa lưu trước đó của radio loại lịch

var gloNgayBatDau = "khongcapnhat";
var gloNgayKetThuc = "khongcapnhat";
var gloGetBatDau = "khongcapnhat";
var gloGetKetThuc = "khongcapnhat";
var gloGetDiaDiem = "khongcapnhat";
var gloGetMaDiaDiem = "khongcapnhat";
var gloGetChuTri = "khongcapnhat";
var gloGetMaChuTri = "khongcapnhat";
var gloGetThanhPhanTD = "khongcapnhat";
var gloGetMaThanhPhanTD = "khongcapnhat";
var gloGetChuanBi = "khongcapnhat";
var gloGetMaTrangThai = "khongcapnhat";
var gloGetHNTH = "khongcapnhat";
var gloGetMaLoaiLich = "khongcapnhat";
var gloGetNoiDung = "khongcapnhat";

function Done(navigation) {
    var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_LichTuan_Update';
    var data = {
        IDLich: idLich,
        UserId: userID,
        BatDau: gloGetBatDau,
        KetThuc: gloGetKetThuc,
        DiaDiem: gloGetDiaDiem,
        MaDiaDiem: gloGetMaDiaDiem,
        ChuTri: gloGetChuTri,
        MaChuTri: gloGetMaChuTri,
        ThanhPhanTD: gloGetThanhPhanTD,
        MaThanhPhanTD: gloGetMaThanhPhanTD,
        ChuanBi: gloGetChuanBi,
        MaTrangThai: gloGetMaTrangThai,
        //HNTH: gloGetHNTH,
        LoaiLich: gloGetMaLoaiLich,
        NoiDung: gloGetNoiDung
    };

    APICall.callPostData(url, data).then((responseAsJson) => {
        if (JSON.stringify(responseAsJson) == '""') {
            Alert.alert(
                'Thông báo',
                'Lưu thành công',
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
            headerTitle: 'Cập nhật',
            headerRight: () => (
                <Button appearance='ghost' status='success' onPress={() => Done(navigation)} style={{ paddingRight: 10 }}>
                    Lưu
                </Button>
            )
        });
    }, [navigation]);

    return <CapNhatDuyetScreen {...props} route={route} navigation={navigation} />;
}

class CapNhatDuyetScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemK: null,
            userID: null,
            visible: false,

            // thời gian
            batDauCurDate: null,
            batDauVisible: false,
            ketThucCurDate: null,
            ketThucVisible: false,
            //---

            // nội dung
            noiDungVisible: false,
            noiDungDataSource: [],
            noiDungLoading: true,
            noiDungRad: null,
            noiDungExtra: '',
            noiDungTextRefresh: '',
            //---

            // chủ trì
            chuTriVisible: false,
            chuTriDataSource: [],
            chuTriLoading: true,
            chuTriRad: null,
            chuTriExtra: '',
            chuTriTextRefresh: '',
            //---

            // địa điểm
            diaDiemVisible: false,
            diaDiemDataSource: [],
            diaDiemLoading: true,
            diaDiemRad: null,
            diaDiemExtra: '',
            diaDiemTextRefresh: '',
            //---

            // thành phần
            thanhPhanVisible: false,
            thanhPhanDataSource: [],
            thanhPhanLoading: true,
            thanhPhanExtra: null,
            checkBoxChecked: [],
            thanhPhanTextRefresh: '',
            //---

            // chuẩn bị
            chuanBiVisible: false,
            chuanBiLoading: true,
            chuanBiExtra: null,
            chuanBiTextRefresh: '',
            //---

            // hội nghị trực tuyến
            hnttRad: null,
            //---

            // trạng thái
            trangThaiVisible: false,
            trangThaiDataSource: [],
            trangThaiLoading: true,
            checkBoxCheckedTT: [],
            trangThaiRad: null,
            trangThaiTextRad: '',
            trangThaiTextRefresh: '',
            //---

            // loại lịch
            loaiLichVisible: false,
            loaiLichDataSource: [],
            loaiLichLoading: true,
            loaiLichRad: null,
            loaiLichTextRad: '',
            loaiLichTextRefresh: '',
            //---
        }
    }

    conditionRender(itemK) {
        if (itemK.HNTH == true) {
            return <Text style={Styles.mttHNTH}>
                {' '}<IconZ name="videocam" /> {'HN trực tuyến '}
            </Text>
        }
        else {
            return <Text style={Styles.mttHNTH}>{' '}</Text>
        }
    }

    render() {
        if (this.state.itemK != null) {
            var itemK = this.state.itemK;

            var gioBatDau = moment(itemK.BatDau).format(fmtTimeVI);
            var gioKetThuc = moment(itemK.KetThuc).format(fmtTimeVI);
            gloNgayBatDau = moment(itemK.BatDau).format(fmtDateTime);
            gloNgayKetThuc = moment(itemK.KetThuc).format(fmtDateTime);

            var batDauStandardDate = moment.utc(this.state.batDauCurDate, fmtTimeVI).local();
            var batDauDisplayDate = batDauStandardDate.format(fmtTimeVI);

            var ketThucStandardDate = moment.utc(this.state.ketThucCurDate, fmtTimeVI).local();
            var ketThucDisplayDate = ketThucStandardDate.format(fmtTimeVI);

            // Khởi tạo thời gian cho picker
            var initBatDau = this.state.batDauCurDate == null ? new Date(moment(itemK.BatDau).format(fmtDateTime)) : new Date(moment(this.state.batDauCurDate).format(fmtDateTime));
            var initKetThuc = this.state.ketThucCurDate == null ? new Date(moment(itemK.KetThuc).format(fmtDateTime)) : new Date(moment(this.state.ketThucCurDate).format(fmtDateTime));
            //---

            return (
                <Layout style={Styles.flexFull}>
                    <ScrollView>
                        <Layout style={Styles.flexFullContent}>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={() => { this.setModalNoiDungVisible(true, itemK) }} appearance='outline' icon={IK.Edit}>
                                            Nội dung
                                        </Button>
                                        <Modal
                                            animationType="slide"
                                            transparent={false}
                                            visible={this.state.noiDungVisible}
                                        >
                                            <Layout style={Styles.flexModal}>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={Styles.flexDirectionRow}>
                                                        <Layout style={Styles.flexFull}>
                                                            {/* <Button appearance='ghost' icon={IK.ArrowBack} status='basic' onPress={() => { this.setModalDiaDiemVisible(false, null) }}>
                                                                Quay lại
                                                            </Button> */}
                                                        </Layout>
                                                        <Layout style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text category='h6' style={{ textAlign: 'center' }}>NỘI DUNG</Text>
                                                        </Layout>
                                                        <Layout style={Styles.flexFull}>
                                                            <Button appearance='ghost' status='success' onPress={() => this.implementNoiDung(itemK)}>
                                                                Xong
                                                            </Button>
                                                        </Layout>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Input
                                                        status='primary'
                                                        selectTextOnFocus
                                                        placeholder="Nhập nội dung"
                                                        onChangeText={(value) => this.setState({ noiDungExtra: value })}
                                                        value={this.state.noiDungExtra == '' ? itemK.NoiDung : this.state.noiDungExtra}
                                                    />
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Button appearance='outline' status='success' onPress={() => this.implementNoiDung(itemK)}>
                                                        Xong
                                                    </Button>
                                                </Layout>
                                            </Layout>
                                        </Modal>
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <HTMLView value={this.state.noiDungTextRefresh != '' ? this.state.noiDungTextRefresh : itemK.NoiDung} stylesheet={{ p: { fontWeight: '600', fontSize: 15, lineHeight: 24, color: '#222B45' } }} />
                                    </Layout>
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={this.batDauShowPicker} appearance='outline' icon={IK.Edit}>
                                            Bắt đầu
                                        </Button>
                                        <DateTimePicker
                                            date={initBatDau}
                                            locale="vi_VI"
                                            mode="datetime"
                                            isVisible={this.state.batDauVisible}
                                            onConfirm={this.batDauPicked}
                                            onCancel={this.batDauHidePicker}
                                        />
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <Text category='s1'>
                                            {this.state.batDauCurDate != null ? batDauDisplayDate : gioBatDau}
                                        </Text>
                                    </Layout>
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={this.ketThucShowPicker} appearance='outline' icon={IK.Edit}>
                                            Kết thúc
                                        </Button>
                                        <DateTimePicker
                                            date={initKetThuc}
                                            locale="vi_VI"
                                            mode="datetime"
                                            isVisible={this.state.ketThucVisible}
                                            onConfirm={this.ketThucPicked}
                                            onCancel={this.ketThucHidePicker}
                                        />
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <Text category='s1'>
                                            {this.state.ketThucCurDate != null ? ketThucDisplayDate : gioKetThuc}
                                        </Text>
                                    </Layout>
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={() => { this.setModalDiaDiemVisible(true, itemK) }} appearance='outline' icon={IK.Edit}>
                                            Địa điểm
                                        </Button>
                                        <Modal
                                            animationType="slide"
                                            transparent={false}
                                            visible={this.state.diaDiemVisible}
                                        >
                                            <Layout style={Styles.flexModal}>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={Styles.flexDirectionRow}>
                                                        <Layout style={Styles.flexFull}>
                                                            {/* <Button appearance='ghost' icon={IK.ArrowBack} status='basic' onPress={() => { this.setModalDiaDiemVisible(false, null) }}>
                                                                Quay lại
                                                            </Button> */}
                                                        </Layout>
                                                        <Layout style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text category='h6' style={{ textAlign: 'center' }}>ĐỊA ĐIỂM</Text>
                                                        </Layout>
                                                        <Layout style={Styles.flexFull}>
                                                            <Button appearance='ghost' status='success' onPress={() => this.implementDiaDiem(itemK)}>
                                                                Xong
                                                            </Button>
                                                        </Layout>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Input
                                                        status='primary'
                                                        selectTextOnFocus
                                                        placeholder="Nhập thêm địa điểm ngoài danh sách"
                                                        onChangeText={(value) => this.setState({ diaDiemExtra: value })}
                                                        value={this.state.diaDiemExtra == '' ? itemK.DiaDiem : this.state.diaDiemExtra}
                                                    />
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    {this.renderDiaDiem()}
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Button appearance='outline' status='success' onPress={() => this.implementDiaDiem(itemK)}>
                                                        Xong
                                                    </Button>
                                                </Layout>
                                            </Layout>
                                        </Modal>
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <Text category='s1'>
                                            {this.state.diaDiemTextRefresh != '' ? this.state.diaDiemTextRefresh : itemK.DiaDiem}
                                        </Text>
                                    </Layout>
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={() => { this.setModalChuTriVisible(true, itemK) }} appearance='outline' icon={IK.Edit}>
                                            Chủ trì
                                        </Button>
                                        <Modal
                                            animationType="slide"
                                            transparent={false}
                                            visible={this.state.chuTriVisible}
                                        >
                                            <Layout style={Styles.flexModal}>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={Styles.flexDirectionRow}>
                                                        <Layout style={Styles.flexFull}>
                                                            {/* <Button appearance='ghost' icon={IK.ArrowBack} status='basic' onPress={() => { this.setModalChuTriVisible(false, null) }}>
                                                                Quay lại
                                                            </Button> */}
                                                        </Layout>
                                                        <Layout style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text category='h6' style={{ textAlign: 'center' }}>CHỦ TRÌ</Text>
                                                        </Layout>
                                                        <Layout style={Styles.flexFull}>
                                                            <Button appearance='ghost' status='success' onPress={() => this.implementChuTri(itemK)}>
                                                                Xong
                                                            </Button>
                                                        </Layout>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Input
                                                        status='primary'
                                                        selectTextOnFocus
                                                        placeholder="Nhập thêm chủ trì ngoài danh sách"
                                                        onChangeText={(value) => this.setState({ chuTriExtra: value })}
                                                        value={this.state.chuTriExtra == '' ? itemK.PhongCT : this.state.chuTriExtra}
                                                    />
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={{ maxHeight: Dimensions.get('window').height - 250 }}>
                                                        <ScrollView>
                                                            {this.renderChuTri()}
                                                        </ScrollView>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Button appearance='outline' status='success' onPress={() => this.implementChuTri(itemK)}>
                                                        Xong
                                                    </Button>
                                                </Layout>
                                            </Layout>
                                        </Modal>
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <Text category='s1'>
                                            {this.state.chuTriTextRefresh != '' ? this.state.chuTriTextRefresh : itemK.PhongCT}
                                        </Text>
                                    </Layout>
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={() => { this.setModalThanhPhanVisible(true, itemK) }} appearance='outline' icon={IK.Edit}>
                                            Thành phần
                                        </Button>
                                        <Modal
                                            animationType="slide"
                                            transparent={false}
                                            visible={this.state.thanhPhanVisible}
                                        >
                                            <Layout style={Styles.flexModal}>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={Styles.flexDirectionRow}>
                                                        <Layout style={Styles.flexFull}>
                                                            {/* <Button appearance='ghost' icon={IK.ArrowBack} status='basic' onPress={() => { this.setModalThanhPhanVisible(false, null) }}>
                                                                Quay lại
                                                            </Button> */}
                                                        </Layout>
                                                        <Layout style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text category='h6' style={{ textAlign: 'center' }}>THÀNH PHẦN</Text>
                                                        </Layout>
                                                        <Layout style={Styles.flexFull}>
                                                            <Button appearance='ghost' status='success' onPress={() => this.implementThanhPhan(itemK)}>
                                                                Xong
                                                            </Button>
                                                        </Layout>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Input
                                                        multiline={true}
                                                        textStyle={{ minHeight: 64 }}
                                                        placeholder='Nhập thêm thành phần ngoài danh sách'
                                                        onChangeText={(value) => this.setState({ thanhPhanExtra: value })}
                                                        value={this.state.thanhPhanExtra == null ? itemK.ThanhPhan : this.state.thanhPhanExtra}
                                                    />
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={{ maxHeight: Dimensions.get('window').height - 350 }}>
                                                        <ScrollView>
                                                            {this.renderThanhPhan()}
                                                        </ScrollView>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Button appearance='outline' status='success' onPress={() => this.implementThanhPhan(itemK)}>
                                                        Xong
                                                    </Button>
                                                </Layout>
                                            </Layout>
                                        </Modal>
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <HTMLView value={this.state.thanhPhanTextRefresh != '' ? this.state.thanhPhanTextRefresh : itemK.ThanhPhan} stylesheet={{ p: { fontWeight: '600', fontSize: 15, lineHeight: 24, color: '#222B45' } }} />
                                    </Layout>
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={() => { this.setModalChuanBiVisible(true) }} appearance='outline' icon={IK.Edit}>
                                            Chuẩn bị
                                        </Button>
                                        <Modal
                                            animationType="slide"
                                            transparent={false}
                                            visible={this.state.chuanBiVisible}
                                        >
                                            <Layout style={Styles.flexModal}>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={Styles.flexDirectionRow}>
                                                        <Layout style={Styles.flexFull}>
                                                            {/* <Button appearance='ghost' icon={IK.ArrowBack} status='basic' onPress={() => { this.setModalChuanBiVisible(false) }}>
                                                                Quay lại
                                                            </Button> */}
                                                        </Layout>
                                                        <Layout style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text category='h6' style={{ textAlign: 'center' }}>CHUẨN BỊ</Text>
                                                        </Layout>
                                                        <Layout style={Styles.flexFull}>
                                                            <Button appearance='ghost' status='success' onPress={() => this.implementChuanBi(itemK)}>
                                                                Xong
                                                            </Button>
                                                        </Layout>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Input
                                                        multiline={true}
                                                        textStyle={{ minHeight: 64 }}
                                                        placeholder='Danh sách chuẩn bị'
                                                        onChangeText={(value) => this.setState({ chuanBiExtra: value })}
                                                        value={this.state.chuanBiExtra == null ? itemK.GhiChu : this.state.chuanBiExtra}
                                                    />
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Button appearance='outline' status='success' onPress={() => this.implementChuanBi(itemK)}>
                                                        Xong
                                                    </Button>
                                                </Layout>
                                            </Layout>
                                        </Modal>
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <HTMLView value={this.state.chuanBiTextRefresh != '' ? this.state.chuanBiTextRefresh : itemK.GhiChu} stylesheet={{ p: { fontWeight: '600', fontSize: 15, lineHeight: 24, color: '#222B45' } }} />
                                    </Layout>
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={() => { this.setModalTrangThaiVisible(true, itemK) }} appearance='outline' icon={IK.Edit}>
                                            Trạng thái
                                        </Button>
                                        <Modal
                                            animationType="slide"
                                            transparent={false}
                                            visible={this.state.trangThaiVisible}
                                        >
                                            <Layout style={Styles.flexModal}>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={Styles.flexDirectionRow}>
                                                        <Layout style={Styles.flexFull}>
                                                            {/* <Button appearance='ghost' icon={IK.ArrowBack} status='basic' onPress={() => { this.setModalTrangThaiVisible(false, null) }}>
                                                                Quay lại
                                                            </Button> */}
                                                        </Layout>
                                                        <Layout style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text category='h6' style={{ textAlign: 'center' }}>TRẠNG THÁI</Text>
                                                        </Layout>
                                                        <Layout style={Styles.flexFull}>
                                                            <Button appearance='ghost' status='success' onPress={() => this.implementTrangThai(itemK)}>
                                                                Xong
                                                            </Button>
                                                        </Layout>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    {this.renderTrangThai(itemK)}
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Button appearance='outline' status='success' onPress={() => this.implementTrangThai(itemK)}>
                                                        Xong
                                                    </Button>
                                                </Layout>
                                            </Layout>
                                        </Modal>
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <Text category='s1'>
                                            {this.renderTextTrangThai(itemK)}
                                        </Text>
                                    </Layout>
                                </Layout>
                            </Layout>
                            <Layout style={Styles.lt_time}>
                                <Layout style={Styles.flexDirectionRow}>
                                    <Layout style={Styles.lt_button_group}>
                                        <Button onPress={() => { this.setModalLoaiLichVisible(true, itemK) }} appearance='outline' icon={IK.Edit}>
                                            Loại lịch
                                        </Button>
                                        <Modal
                                            animationType="slide"
                                            transparent={false}
                                            visible={this.state.loaiLichVisible}
                                        >
                                            <Layout style={Styles.flexModal}>
                                                <Layout style={Styles.lt_time}>
                                                    <Layout style={Styles.flexDirectionRow}>
                                                        <Layout style={Styles.flexFull}>
                                                            {/* <Button appearance='ghost' icon={IK.ArrowBack} status='basic' onPress={() => { this.setModalLoaiLichVisible(false, null) }}>
                                                                Quay lại
                                                            </Button> */}
                                                        </Layout>
                                                        <Layout style={{ flex: 1, justifyContent: 'center' }}>
                                                            <Text category='h6' style={{ textAlign: 'center' }}>LOẠI LỊCH</Text>
                                                        </Layout>
                                                        <Layout style={Styles.flexFull}>
                                                            <Button appearance='ghost' status='success' onPress={() => this.implementLoaiLich(itemK)}>
                                                                Xong
                                                            </Button>
                                                        </Layout>
                                                    </Layout>
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    {this.renderLoaiLich(itemK)}
                                                </Layout>
                                                <Layout style={Styles.lt_time}>
                                                    <Button appearance='outline' status='success' onPress={() => this.implementLoaiLich(itemK)}>
                                                        Xong
                                                    </Button>
                                                </Layout>
                                            </Layout>
                                        </Modal>
                                    </Layout>
                                    <Layout style={Styles.lt_button_group}>
                                        <Text category='s1'>
                                            {this.state.loaiLichTextRefresh != '' ? this.state.loaiLichTextRefresh : itemK.HinhThuc}
                                        </Text>
                                        {/* <HTMLView value={this.state.loaiLichTextRefresh != '' ? this.state.loaiLichTextRefresh : itemK.HinhThuc} stylesheet={{ p: { fontWeight: '600', fontSize: 15, lineHeight: 24, color: '#222B45' } }} /> */}
                                    </Layout>
                                </Layout>
                            </Layout>
                        </Layout>
                    </ScrollView>
                    <ModalLogin visible={this.state.visible} />
                </Layout>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    //#region Nội dung
    implementNoiDung(item) {
        if (this.state.noiDungExtra != '') {
            var result = '';

            if (this.state.noiDungExtra == '') {
                result = item.NoiDung
            }
            else {
                result = this.state.noiDungExtra
            }

            this.setState({
                noiDungLoading: true,
                noiDungTextRefresh: result,
            }, () => {
                gloGetNoiDung = result;
                this.setModalNoiDungVisible(false, null);
            })
        }
        else {
            this.setModalNoiDungVisible(false, null)
        }
    }

    setModalNoiDungVisible(value, data) {
        this.setState({
            noiDungVisible: value,
        })
    }
    //#endregion

    //#region Chủ trì
    implementChuTri(item) {
        if (this.state.chuTriExtra != '' || this.state.chuTriRad != null) {
            var result = '';
            var ma = '';

            if (this.state.chuTriExtra == '' && this.state.chuTriRad == null) {
                result = item.PhongCT
                ma = maChuTri
            }
            else {
                result = this.state.chuTriExtra
                ma = this.state.chuTriRad
            }

            this.setState({
                chuTriLoading: true,
                chuTriTextRefresh: result
            }, () => {
                gloGetChuTri = result
                gloGetMaChuTri = ma
                this.setModalChuTriVisible(false, null);
            })
        }
        else {
            this.setModalChuTriVisible(false, null)
        }
    }

    setModalChuTriVisible(value, data) {
        this.setState({
            chuTriVisible: value,
        })

        if (value) {
            this.fetchDataChuTri(data)
        }
    }

    fetchDataChuTri(item) {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_ChuTri_Select';
        var data = {
            IDLich: item.IDLich,
            //UserId: this.state.userID,
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (typeof responseAsJson.status !== 'undefined') {
                if (responseAsJson.status === 401) { // Invalid token
                    this.setState({
                        visible: true,
                        chuTriLoading: false
                    })
                }
            }
            else {
                this.setState({
                    chuTriDataSource: responseAsJson,
                    chuTriLoading: false
                });
            }
        })
    }

    renderChuTri() {
        if (!this.state.chuTriLoading) {
            if (this.state.chuTriDataSource.length > 0) {
                const list = this.state.chuTriDataSource.map((itemSource, keySource) => {
                    var setCheck = false; // biến dùng để thiết lập true/false selected

                    if (this.state.chuTriRad == null && itemSource.isSelect == true) {
                        setCheck = true;
                        maChuTri = itemSource.MaPhong;
                    }
                    else {
                        if (this.state.chuTriRad == itemSource.MaPhong) {
                            setCheck = true;
                            maChuTri = itemSource.MaPhong;
                        }
                    }

                    return (
                        <Radio key={keySource} checked={setCheck} style={Styles.grid} onChange={() => {
                            this.setState({ chuTriRad: itemSource.MaPhong, chuTriExtra: itemSource.TenPhong })
                        }} text={itemSource.TenPhong} />
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
    //#endregion

    //#region Địa điểm
    implementDiaDiem(item) {
        if (this.state.diaDiemExtra != '' || this.state.diaDiemRad != null) {
            var result = '';
            var ma = '';

            if (this.state.diaDiemExtra == '' && this.state.diaDiemRad == null) {
                result = item.DiaDiem
                ma = maDiaDiem
            }
            else {
                result = this.state.diaDiemExtra
                ma = this.state.diaDiemRad
            }

            this.setState({
                diaDiemLoading: true,
                diaDiemTextRefresh: result,
            }, () => {
                gloGetDiaDiem = result
                gloGetMaDiaDiem = ma
                this.setModalDiaDiemVisible(false, null);
            })
        }
        else {
            this.setModalDiaDiemVisible(false, null)
        }
    }

    setModalDiaDiemVisible(value, data) {
        this.setState({
            diaDiemVisible: value,
        })

        if (value) {
            this.fetchDataDiaDiem(data)
        }
    }

    fetchDataDiaDiem(item) {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_DiaDiem_Select';
        var data = {
            IDLich: item.IDLich,
            //UserId: this.state.userID,
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (typeof responseAsJson.status !== 'undefined') {
                if (responseAsJson.status === 401) { // Invalid token
                    this.setState({
                        visible: true,
                        diaDiemLoading: false
                    })
                }
            }
            else {
                this.setState({
                    diaDiemDataSource: responseAsJson,
                    diaDiemLoading: false
                });
            }
        })
    }

    renderDiaDiem() {
        if (!this.state.diaDiemLoading) {
            if (this.state.diaDiemDataSource.length > 0) {
                const list = this.state.diaDiemDataSource.map((itemSource, keySource) => {
                    var setCheck = false; // biến dùng để thiết lập true/false selected

                    if (this.state.diaDiemRad == null && itemSource.isSelect == true) {
                        setCheck = true;
                        maDiaDiem = itemSource.MaPhongHop;
                    }
                    else {
                        if (this.state.diaDiemRad == itemSource.MaPhongHop) {
                            setCheck = true;
                            maDiaDiem = itemSource.MaPhongHop;
                        }
                    }

                    return (
                        <Radio key={keySource} checked={setCheck} style={Styles.grid} onChange={() => {
                            this.setState({ diaDiemRad: itemSource.MaPhongHop, diaDiemExtra: itemSource.TenPhongHop })
                        }} text={itemSource.TenPhongHop} />
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_COMBOBOX_DIADIEM)
            }
        }
        else {
            return <MyActivityIndicator />
        }
    }
    //#endregion

    //#region Thành phần
    implementThanhPhan(item) {
        if (this.state.thanhPhanExtra != '') {
            var finalArrayChecked = Array.from(new Set(arrayChecked));
            var finalArrayText = Array.from(new Set(arrayText));

            this.setState({
                thanhPhanLoading: true,
                thanhPhanTextRefresh: finalArrayText.toString(),
            }, () => {
                gloGetThanhPhanTD = finalArrayText.toString()
                gloGetMaThanhPhanTD = finalArrayChecked.toString()
                this.setModalThanhPhanVisible(false, null);
            })
        }
        else {
            this.setModalThanhPhanVisible(false, null)
        }
    }

    setModalThanhPhanVisible(value, data) {
        this.setState({
            thanhPhanVisible: value,
        })

        if (value) {
            this.fetchDataThanhPhan(data)
        }
    }

    fetchDataThanhPhan(item) {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_ThanhPhanTD_Select';
        var data = {
            IDLich: item.IDLich,
            //UserId: this.state.userID,
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (typeof responseAsJson.status !== 'undefined') {
                if (responseAsJson.status === 401) { // Invalid token
                    this.setState({
                        visible: true,
                        thanhPhanLoading: false
                    })
                }
            }
            else {
                arrayChecked = [];
                arrayText = [];

                this.setState({
                    thanhPhanDataSource: responseAsJson,
                    thanhPhanLoading: false
                });
            }
        })
    }

    renderThanhPhan() {
        if (!this.state.thanhPhanLoading) {
            if (this.state.thanhPhanDataSource.length > 0) {
                const list = this.state.thanhPhanDataSource.map((itemSource, keySource) => {
                    var setCheck = true;
                    var stateCheck = -1;

                    if (this.state.checkBoxChecked[itemSource.MaPhong] == undefined && itemSource.isSelect == true) {
                        arrayChecked.push(itemSource.MaPhong);
                        arrayText.push(itemSource.VietTat);
                        stateCheck = 1
                    }
                    else {
                        if (itemSource.isSelect) {
                            setCheck = !this.state.checkBoxChecked[itemSource.MaPhong]
                            stateCheck = 1
                        }
                        else {
                            setCheck = this.state.checkBoxChecked[itemSource.MaPhong]
                            stateCheck = 0
                        }
                    }

                    return (
                        <CheckBox key={keySource} checked={setCheck} style={Styles.grid} onChange={() => {
                            this.change(itemSource.MaPhong, itemSource.VietTat, this.state.checkBoxChecked[itemSource.MaPhong], stateCheck)
                        }} text={itemSource.TenPhong} />
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_THANHPHANTHAMDU);
            }
        }
        else {
            return <MyActivityIndicator />
        }
    }

    change(id, text, value, stateS) {
        this.setState({
            checkBoxChecked: tempCheckValues
        })

        var tempCheckBoxChecked = this.state.checkBoxChecked;
        tempCheckBoxChecked[id] = !value;

        this.setState({
            checkBoxChecked: tempCheckBoxChecked
        })

        if ((this.state.checkBoxChecked[id] == true && stateS == 0) ||
            (this.state.checkBoxChecked[id] == false && stateS == 1)) {
            arrayChecked.push(id);
            arrayText.push(text);
        }

        if ((this.state.checkBoxChecked[id] == false && stateS == 0) ||
            (this.state.checkBoxChecked[id] == true && stateS == 1)) {
            arrayChecked = arrayChecked.filter(item => item != id);
            arrayText = arrayText.filter(item => item != text);
        }

        var result = Array.from(new Set(arrayText));
        this.setState({
            thanhPhanExtra: result.toString(),
        })
    }
    //#endregion

    //#region Trạng thái
    implementTrangThai(item) {
        if (this.state.trangThaiTextRefresh != '') {
            var finalArrayChecked = Array.from(new Set(arrayCheckedTT));
            var finalArrayText = Array.from(new Set(arrayTextTT));

            this.setState({
                trangThaiLoading: true,
                trangThaiTextRefresh: finalArrayText.toString(),
            }, () => {
                gloGetMaTrangThai = finalArrayChecked.toString()
                this.setModalTrangThaiVisible(false, null);
            })
        }
        else {
            this.setModalTrangThaiVisible(false, null)
        }
    }

    setModalTrangThaiVisible(value, data) {
        this.setState({
            trangThaiVisible: value,

        })

        if (!this.state.trangThaiDone) {
            if (value) {
                this.fetchDataTrangThai(data)
            }
        }
    }

    fetchDataTrangThai(item) {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_TrangThai_Select';
        var data = {
            IDLich: item.IDLich,
            //UserId: this.state.userID,
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (typeof responseAsJson.status !== 'undefined') {
                if (responseAsJson.status === 401) { // Invalid token
                    this.setState({
                        visible: true,
                        trangThaiLoading: false
                    })
                }
            }
            else {
                arrayCheckedTT = [];
                arrayText = [];

                this.setState({
                    trangThaiDataSource: responseAsJson,
                    trangThaiLoading: false
                });
            }
        })
    }

    renderTextTrangThai(arr) {
        if (this.state.trangThaiTextRefresh != '') {
            return this.state.trangThaiTextRefresh;
        }
        else {
            return this.renderListTrangThai(arr);
        }
    }

    renderListTrangThai(arr) {
        if (arr.DsTrangThai.length > 0) {
            var list = arr.DsTrangThai.map((item, key) => {
                return (
                    <Text key={key} style={this.renderStylesText(item.MauHienThi)}>
                        {item.TenTrangThai == '' ? '' : '(' + item.TenTrangThai + ') '}
                    </Text>
                )
            })

            return list;
        }
        else {
            return 'Bình thường';
        }
    }

    renderTrangThai(item) {
        if (!this.state.trangThaiLoading) {
            if (this.state.trangThaiDataSource.length > 0) {
                const list = this.state.trangThaiDataSource.map((itemSource, keySource) => {
                    var setCheck = true;
                    var stateCheck = -1;
                    var textTrangThai = '';

                    if (itemSource.TenTrangThai == '') {
                        textTrangThai += 'Bình thường'
                    }
                    else {
                        textTrangThai += itemSource.TenTrangThai
                    }

                    if (this.state.checkBoxCheckedTT[itemSource.IDTrangThai] == undefined && itemSource.isSelect == true) {
                        arrayCheckedTT.push(itemSource.IDTrangThai);
                        arrayTextTT.push(textTrangThai);
                        stateCheck = 1
                    }
                    else {
                        if (itemSource.isSelect) {
                            setCheck = !this.state.checkBoxCheckedTT[itemSource.IDTrangThai]
                            stateCheck = 1
                        }
                        else {
                            setCheck = this.state.checkBoxCheckedTT[itemSource.IDTrangThai]
                            stateCheck = 0
                        }
                    }

                    return (
                        <CheckBox key={keySource} checked={setCheck} style={Styles.grid} onChange={() => {
                            this.changeTT(itemSource.IDTrangThai, textTrangThai, this.state.checkBoxCheckedTT[itemSource.IDTrangThai], stateCheck)
                        }} text={textTrangThai} />
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

    changeTT(id, text, value, stateS) {
        this.setState({
            checkBoxCheckedTT: tempCheckValues
        })

        var tempCheckBoxChecked = this.state.checkBoxCheckedTT;
        tempCheckBoxChecked[id] = !value;

        this.setState({
            checkBoxCheckedTT: tempCheckBoxChecked
        })

        if ((this.state.checkBoxCheckedTT[id] == true && stateS == 0) ||
            (this.state.checkBoxCheckedTT[id] == false && stateS == 1)) {
            arrayCheckedTT.push(id);
            arrayTextTT.push(text);
        }

        if ((this.state.checkBoxCheckedTT[id] == false && stateS == 0) ||
            (this.state.checkBoxCheckedTT[id] == true && stateS == 1)) {
            arrayCheckedTT = arrayCheckedTT.filter(item => item != id);
            arrayTextTT = arrayTextTT.filter(item => item != text);
        }

        var result = Array.from(new Set(arrayTextTT));
        this.setState({
            trangThaiTextRefresh: result.toString(),
        })
    }
    //#endregion

    //#region Chuẩn bị
    implementChuanBi(item) {
        if (this.state.chuanBiExtra != null) {
            this.setState({
                chuanBiLoading: true,
                chuanBiTextRefresh: this.state.chuanBiExtra
            }, () => {
                gloGetChuanBi = this.state.chuanBiExtra
                this.setModalChuanBiVisible(false, null);
            })
        }
        else {
            this.setModalChuanBiVisible(false, null)
        }
    }

    setModalChuanBiVisible(value) {
        this.setState({
            chuanBiVisible: value,
        })
    }
    //#endregion

    //#region Hội nghị trực tuyến
    renderHNTT(item) {
        if (item.HNTH != null && this.state.hnttRad == null) {
            this.state.hnttRad = item.HNTH
        }

        return (
            <CheckBox checked={this.state.hnttRad} style={{ justifyContent: 'flex-end' }} onChange={() => this.changeHNTT()} />
        )
    }

    changeHNTT() {
        var value = !this.state.hnttRad;
        this.setState({
            hnttRad: value
        }, () => {
            gloGetHNTH = value;
        })
    }
    //#endregion

    //#region Loại lịch
    implementLoaiLich(item) {
        if (this.state.loaiLichRad != null) {
            this.setState({
                loaiLichTextRefresh: this.state.loaiLichTextRad
            }, () => {
                gloGetMaLoaiLich = this.state.loaiLichRad
                this.setModalLoaiLichVisible(false, null);
            })
        }
        else {
            this.setModalLoaiLichVisible(false, null)
        }
    }

    setModalLoaiLichVisible(value, data) {
        this.setState({
            loaiLichVisible: value
        })

        if (value) {
            this.fetchDataLoaiLich(data)
        }
    }

    fetchDataLoaiLich(item) {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_LoaiLich_Select';
        var data = {
            IDLich: item.IDLich,
            //UserId: this.state.userID,
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (typeof responseAsJson.status !== 'undefined') {
                if (responseAsJson.status === 401) { // Invalid token
                    this.setState({
                        visible: true,
                        loaiLichLoading: false
                    })
                }
            }
            else {
                this.setState({
                    loaiLichDataSource: responseAsJson,
                    loaiLichLoading: false
                });
            }
        })
    }

    renderLoaiLich(item) {
        if (!this.state.loaiLichLoading) {
            if (this.state.loaiLichDataSource.length > 0) {
                const list = this.state.loaiLichDataSource.map((itemSource, keySource) => {
                    var setCheck = false; // biến dùng để thiết lập true/false selected

                    if (
                        (
                            this.state.loaiLichRad == null &&
                            itemSource.IDLoai == item.IDLoai && itemSource.isSelect &&
                            prevStateLoaiLich == -1
                        ) ||
                        (
                            this.state.loaiLichRad == null &&
                            itemSource.IDLoai == prevStateLoaiLich && itemSource.isSelect &&
                            prevStateLoaiLich != -1
                        )
                    ) {
                        setCheck = true;
                    }
                    else {
                        if (this.state.loaiLichRad == itemSource.IDLoai) {
                            setCheck = true
                        }
                    }

                    return (
                        <Radio key={keySource} checked={setCheck} style={Styles.grid} onChange={() => {
                            this.setState({ loaiLichRad: itemSource.IDLoai, loaiLichTextRad: itemSource.TenLoai })
                        }} text={itemSource.TenLoai} />
                    )
                })

                return list;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_COMBOBOX_LOAILICH)
            }
        }
        else {
            return <MyActivityIndicator />
        }
    }
    //#endregion

    componentDidMount() {
        const { route } = this.props;
        const value = route.params.itemK;

        Session.getUserInfo().then((goals) => {
            this.setState({
                itemK: value,
                userID: goals.UserId,
                loading: false
            }, () => {
                idLich = value.IDLich;
                userID = this.state.userID;
            })
        });
    }

    batDauShowPicker = () => {
        this.setState({ batDauVisible: true });
    };

    batDauHidePicker = () => {
        this.setState({ batDauVisible: false });
    };

    batDauPicked = date => {
        var value = moment(date).format(fmtDateTime);
        var comp = (this.state.ketThucCurDate != null ? moment(this.state.ketThucCurDate).format(fmtDateTime) : gloNgayKetThuc);
        var textValue = moment(value).format(fmtTimeVI);
        var textComp = moment(comp).format(fmtTimeVI);

        if (new Date(value) <= new Date(comp)) {
            var final = moment(date).format(fmtTimeEN);
            gloGetBatDau = final;
            this.setState({
                batDauCurDate: date
            }, () => {
                this.batDauHidePicker();
            })
        }
        else {
            Alert.alert(
                'Thông báo',
                'Ngày bắt đầu (' + textValue + ') phải nhỏ hơn ngày kết thúc (' + textComp + ')',
                [
                    {
                        text: 'OK', onPress: () => {
                        }
                    },
                ],
                { cancelable: false },
            );
        }
    };

    ketThucShowPicker = () => {
        this.setState({ ketThucVisible: true });
    };

    ketThucHidePicker = () => {
        this.setState({ ketThucVisible: false });
    };

    ketThucPicked = date => {
        var value = moment(date).format(fmtDateTime);
        var comp = (this.state.batDauCurDate != null ? moment(this.state.batDauCurDate).format(fmtDateTime) : gloNgayBatDau);
        var textValue = moment(value).format(fmtTimeVI);
        var textComp = moment(comp).format(fmtTimeVI);

        if (new Date(value) >= new Date(comp)) {
            var final = moment(date).format(fmtTimeEN);
            gloGetKetThuc = final;
            this.setState({
                ketThucCurDate: date
            }, () => {
                this.ketThucHidePicker();
            })
        }
        else {
            Alert.alert(
                'Thông báo',
                'Ngày kết thúc (' + textValue + ') phải lớn hơn ngày bắt đầu (' + textComp + ')',
                [
                    {
                        text: 'OK', onPress: () => {
                        }
                    },
                ],
                { cancelable: false },
            );
        }
    };

    renderStyles(myColor) {
        return {
            p: {
                fontWeight: 'bold',
                color: '#' + myColor
            }
        }
    }

    renderStylesText(myColor) {
        return {
            fontWeight: 'bold',
            color: '#' + myColor
        }
    }
}