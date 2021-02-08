import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    content: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    detailContent: {
        paddingTop: 5,
    },
    grid: {
        padding: 10
    },
    row: {
        paddingTop: 5,
        paddingBottom: 5
    },
    rowBorderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#efefef'
    },
    form: {
        padding: 10,
    },
    activity: {
        flex: 1,
        paddingTop: 20
    },
    modal: {
        backgroundColor: 'white',
        paddingTop: 30,
        paddingBottom: 20,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    lbError: {
        textAlign: 'center',
        color: '#ffc107',
        fontWeight: 'bold'
    },
    textBold: {
        fontWeight: 'bold'
    },
    mttTGian: {
        color: 'black'
    },
    mttGioBatDau: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: 18
    },
    mttNoiDung: {
        height: '100%',
        textAlign: 'left',
        justifyContent: 'flex-start'
    },
    mttHNTH: {
        color: '#dc3545',
        fontWeight: 'bold'
    },
    mttChuTri: {
        color: 'black'
    },
    mttDiaDiem: {
        color: 'black'
    },
    mttThanhPhan: {
        color: 'black'
    },
    mttChuanBi: {
        color: 'black'
    },
    mttBtnNoiDung: {
        height: '100%'
    },
    textPrimary: {
        color: '#007bff'
    },
    textSuccess: {
        color: '#28a745'
    },
    textDanger: {
        color: '#dc3545'
    },
    textWarning: {
        color: '#ffc107'
    },
    textInfo: {
        color: '#17a2b8'
    },
    textSecondaryBold: {
        color: '#6c757d'
    },
    textWhite: {
        color: '#fff'
    },
    textBlack: {
        color: '#000'
    },
    textPrimaryBold: {
        color: '#007bff',
        fontWeight: 'bold'
    },
    textSuccessBold: {
        color: '#28a745',
        fontWeight: 'bold'
    },
    textDangerBold: {
        color: '#dc3545',
        fontWeight: 'bold'
    },
    textWarningBold: {
        color: '#ffc107',
        fontWeight: 'bold'
    },
    textInfoBold: {
        color: '#17a2b8',
        fontWeight: 'bold'
    },
    textSecondaryBold: {
        color: '#6c757d',
        fontWeight: 'bold'
    },
    textWhiteBold: {
        color: '#fff',
        fontWeight: 'bold'
    },
    textBlackBold: {
        color: '#000',
        fontWeight: 'bold'
    },
    liSelected: {
        backgroundColor: '#007bff',
    },
    liNotSelected: {
        backgroundColor: 'white',
    },
    txtSelected: {
        color: 'white'
    },
    txtNotSelected: {
        color: 'black'
    },
    btnWrapText: {
        height: '100%',
        flexDirection: 'column',
        //marginLeft: -10,
        alignItems: 'flex-start'
    },
    alignCenter: {
        alignItems: 'center'
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    align_justify_center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container_layout_level: {
        flex: 1,
        flexDirection: 'row',
    },
    flexFull: {
        flex: 1
    },
    flexFullContent: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    flexFullJustifyCenter: {
        flex: 1,
        justifyContent: 'center'
    },
    flexModal: {
        flex: 1,
        marginTop: 50,
        marginVertical: 5,
        marginHorizontal: 5
    },
    flexDirectionColumn: {
        flexDirection: 'column'
    },
    flexDirectionRow: {
        flexDirection: 'row'
    },
    tabView: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5
    },
    listTitle: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 10,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#0095ff',
    },
    marHorVer10: {
        marginHorizontal: 10,
        marginVertical: 10
    },
    padWarningCom: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5
    },
    cardHeader: {
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    bd_left_primary: {
        borderLeftColor: '#007bff',
        borderLeftWidth: 5
    },

    /* DangNhapScreen */
    dn_scrollView: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    dn_viewButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    dn_btnLogin: {
        //marginTop: 30,
        backgroundColor: '#29487d'
    },
    dn_imgBackground: {
        // width: '100%',
        // height: '100%',
        flex: 1,
        // resizeMode: 'cover',
        // position: 'absolute',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    dn_title: {
        color: 'black',
        fontSize: 30,
        fontWeight: '800',
        lineHeight: 72,
        textAlign: 'center',
        marginBottom: 50
    },
    dn_lbInfo: {
        color: 'black'
    },
    dn_lbError: {
        color: 'red',
        paddingLeft: 15,
        paddingTop: 5,
    },
    dn_picker: {
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    dn_txtPicker: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dn_txtInput: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        marginTop: 2,
        backgroundColor: 'white',
        borderRadius: 5
    },
    dn_iconPicker: {
        color: 'black',
        marginLeft: 5
    },
    dn_iconInput: {
        color: 'black',
    },
    dn_caption: {
        flex: 1,
        color: '#dc3545',
        backgroundColor: '#fff',
        padding: 5,
    },
    dn_GeneralContainer: {
        alignItems: 'center',
        flex: 1
    },
    dn_headerContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    dn_formContainer: {
        paddingBottom: 32,
        //flex: 1,
        width: Dimensions.get('window').width - 50,
        justifyContent: 'flex-end'
    },
    dn_signInLabel: {
        marginTop: 16,
    },

    /* HomeScreen */
    btnHome: {
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHome: {
        fontSize: 20,
        textAlign: 'center',
    },
    iconNoti: {
        color: '#eb9e3e'
    },
    iconCal: {
        color: '#4dad4a'
    },
    iconList: {
        color: '#529ff3'
    },
    iconDoc: {
        color: '#0a60ff'
    },
    iconCar: {
        color: '#ce3c3e'
    },
    iconContact: {
        color: '#000000'
    },
    colHome: {
        padding: 5
    },
    h_card_Noti: {
        borderLeftColor: '#eb9e3e',
        borderLeftWidth: 5,
        justifyContent: 'center',
        alignContent: 'center',
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    h_marginBottom: {
        marginBottom: 10
    },
    h_detailContent: {
        marginVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: '#efefef',
        borderRadius: 3
    },

    /* LichTuanScreen */
    lt_calendar: {
        backgroundColor: '#fff',
        height: 60,
        borderBottomColor: '#ff3d71',
        borderBottomWidth: 1
    },
    lt_lbNav: {
        textAlign: 'center',
        paddingTop: 5
    },
    lt_iconNav: {
        color: 'white',
        fontSize: 16
    },
    lt_colNav: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%"
    },
    lt_textCalendar: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    lt_top: {
        flexDirection: 'row',
        marginVertical: 5
    },
    lt_time: {
        marginVertical: 5
    },
    lt_status: {
        flex: 1,
        marginHorizontal: 20
    },
    lt_status_inside: {
        flexDirection: 'row',
        marginVertical: 5
    },
    lt_bottom: {
        flexDirection: 'row',
        marginTop: 10
    },
    lt_card_right: {
        flex: 1,
        marginRight: 5,
    },
    lt_card_left: {
        flex: 1,
        marginLeft: 5,
    },
    lt_card_title: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lt_card_content: {
        marginTop: 10
    },
    lt_detailContent: {
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10
    },
    lt_button_group: {
        flex: 1,
        paddingHorizontal: 5
    },
    lt_button_group_left: {
        flex: 1,
        marginRight: 5
    },
    lt_button_group_right: {
        flex: 1,
        marginLeft: 5
    },
    lt_check: {
        marginVertical: 5,
        marginHorizontal: 5
    },
    lt_grp_title: {
        backgroundColor: '#3366ff',
        padding: 15
    },
    lt_bor_primary: {
        borderLeftColor: '#007bff', 
        borderLeftWidth: 5, 
        paddingLeft: 5
    },
    lt_bor_warning: {
        borderLeftColor: '#ffc107', 
        borderLeftWidth: 5, 
        paddingLeft: 5
    },

    /* ThongBaoScreen */
    tb_moduleTitle: {
        fontStyle: 'italic',
        fontSize: 14
    },
    tb_colSeenIcon: {
        width: 20
    },
    tb_relativeTime: {
        color: 'gray',
        fontSize: 9
    },
    tb_detailContent: {
        borderBottomWidth: 1,
        borderBottomColor: '#dddfe2',
    },
    tb_content: {
        paddingHorizontal: 15,
        paddingVertical: 5
    },

    /* SettingsScreen */
    set_btn: {
        justifyContent: 'flex-start'
    },

    /* CapNhatDuyetScreen */
    cnd_row: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
    },
    cnd_titleCol: {
        width: 150
    },
    cnd_row_no_border: {
        padding: 0,
    },

    /* TemplateHTML */
    thtml_detailContent: {
        paddingTop: 5,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
    },

    /* TabThongTin */
    ttt_rowNoiDung: {
        marginTop: 5,
        marginBottom: 5
    },
    ttt_col: {
        borderLeftWidth: 2,
        borderLeftColor: "#ffc107",
        padding: 5
    },
    ttt_col2: {
        borderLeftWidth: 2,
        borderLeftColor: "#007bff",
        padding: 5
    },

    /* TabThanhPhan */
    ttp_mttColTenPhong: {
        backgroundColor: '#007bff',
        padding: 5
    },
    ttp_mttTextTenPhong: {
        color: 'white',
        fontWeight: 'bold'
    },
    ttp_mttTenHienThi: {
        paddingTop: 2,
        color: 'black'
    },

    /* TabTaiLieu */
    ttl_btnDown: {
        borderBottomColor: '#007bff',
        borderBottomWidth: 1,
    },
    ttl_fileName: {
        fontSize: 16,
    },

    /* MainGSCV */
    gscv_header: {
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: '#007bff',
    },
    gscv_txtHeader: {
        fontWeight: "600",
        color: '#007bff'
    },
    gscv_iconHeader: {
        fontSize: 18,
        color: '#007bff'
    },
    gscv_titleContent: {
        padding: 10,
        fontStyle: "italic",
    },
    gscv_colTitleContent: {
        borderLeftWidth: 2,
        borderLeftColor: "#ffc107",
    },
    gscv_number: {
        fontWeight: 'bold'
    },

    /* ChiTietCV */
    ctcv_star: {
        fontSize: 20,
        color: "#007bff"
    },
    ctcv_trangthai: {
        color: "#17a2b8"
    },

    /* DanhSachCongViecScreen */
    dscv_bl_card: {
        backgroundColor: '#17a2b8',
        color: '#fff'
    },
    dscv_title_item: {
        fontWeight: 'bold',
        color: '#000'
    },
    dscv_col_picker: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100
    },
    dscv_fix_padding_text: {
        paddingLeft: 15
    },
    dscv_col_check: {
        width: 50,
        justifyContent: 'center'
    },
    dscv_txt_picker: {
        color: 'gray',
        fontWeight: 'bold',
    },

    /* TabBaoCao - ChiTietCongViecScreen */
    bc_ctcv_textbox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fefefe',
        padding: 5
    }
});
