import React, { Component } from 'react';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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
    Button,
    ListItem,
    CheckBox,
    Layout,
    Text
} from '@ui-kitten/components';

var tempCheckValues = [];
var arrayChecked = [];
var idLich = null;
var userID = null;

function Done(navigation) {
    if (arrayChecked.length > 0) {
        var finalArray = Array.from(new Set(arrayChecked));
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_CBNVThamDuInsert';
        var data = {
            IDLich: idLich,
            UserId: userID,
            DsThamDu: finalArray.toString()
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (JSON.stringify(responseAsJson) == '""') {
                Alert.alert(
                    'Thông báo',
                    'Thêm thành phần thành công',
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
}

export default function (props) {
    const route = useRoute();
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Thêm thành phần',
            headerRight: () => (
                <Button appearance='ghost' status='success' onPress={() => Done(navigation)} style={{ paddingRight: 10 }}>
                    Lưu
                </Button>
            )
        });
    }, [navigation]);

    return <ThemThanhPhanScreen {...props} route={route} navigation={navigation} />;
}

class ThemThanhPhanScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: null,
            IDLich: null, // lấy tham số ngày từ component cha
            userID: null,
            dataSource: [], // lưu trữ dữ liệu json
            loading: true,
            checkBoxChecked: [],
            invi: 'none',
            visible: false
        }
    }

    conditionRender() {
        let dataS = this.state.dataSource;

        if (dataS) {
            const values_id = this.group_to_values_by_id(dataS);
            const convert_id = this.groups_by_id(values_id);

            if (convert_id.length > 0) {
                const res = convert_id.map((item, key) => {
                    var groupName = '';
                    const list = dataS.map((itemSource, keySource) => {
                        if (item.MaPhong == itemSource.MaPhong) {
                            groupName = itemSource.TenPhong;
                            var setCheck = true;
                            var stateCheck = -1;

                            if (this.state.checkBoxChecked[itemSource.UserID] == undefined && itemSource.CheckUser == true) {
                                arrayChecked.push(itemSource.UserID);
                                stateCheck = 1
                            }
                            else {
                                if (itemSource.CheckUser) {
                                    setCheck = !this.state.checkBoxChecked[itemSource.UserID]
                                    stateCheck = 1
                                }
                                else {
                                    setCheck = this.state.checkBoxChecked[itemSource.UserID]
                                    stateCheck = 0
                                }
                            }

                            return (
                                <CheckBox key={keySource} checked={setCheck} style={Styles.grid} onChange={() => {
                                    this.change(itemSource.UserID, this.state.checkBoxChecked[itemSource.UserID], stateCheck)
                                }} text={itemSource.TenHienThi} />
                            )
                        }
                    })

                    return (
                        <Layout key={key}>
                            <Layout style={Styles.listTitle}>
                                <Text category='h5' status='info'>{groupName}</Text>
                            </Layout>
                            <Layout>
                                {list}
                            </Layout>
                        </Layout>
                    )
                })

                return res;
            }
            else {
                return TextMessage.TextWarning(ErrorMessage.ERROR_THANHPHANTHAMDU);
            }
        }
        else {
            return TextMessage.TextWarning(ErrorMessage.ERROR_THANHPHANTHAMDU);
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

    // Được gọi ở lần đầu tiên và chỉ duy nhất 1 lần gọi
    componentDidMount() {
        const { route } = this.props;
        const { navigation } = this.props;
        const value = route.params.IDLich;

        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId,
                IDLich: value,
                navigation: navigation
            }, () => {
                idLich = this.state.IDLich;
                userID = this.state.userID;
                this.fetchData();
            })
        });
    }

    change(id, value, stateS) {
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
        }

        if ((this.state.checkBoxChecked[id] == false && stateS == 0) ||
            (this.state.checkBoxChecked[id] == true && stateS == 1)) {
            arrayChecked = arrayChecked.filter(item => item != id);
        }
    }

    fetchData() {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_CBNVThamDuGetDanhSach';
        var data = {
            IDLich: this.state.IDLich,
            //UserId: this.state.userID,
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

    group_to_values(myArray) {
        const result = myArray.reduce(function (obj, item) {
            item.TenHienThi = item.TenHienThi.trim();
            obj[item.TenPhong] = obj[item.TenPhong] || [];
            obj[item.TenPhong].push(item.TenHienThi + "\n");

            return obj;
        }, {})

        return result;
    };

    groups(group_to_values) {
        const result = Object.keys(group_to_values).map(function (key) {
            return { TenPhong: key, TenHienThi: group_to_values[key] };
        })

        return result;
    };

    group_to_values_by_id(myArray) {
        const result = myArray.reduce(function (obj, item) {
            item.TenHienThi = item.TenHienThi.trim();
            obj[item.MaPhong] = obj[item.MaPhong] || [];
            obj[item.MaPhong].push(item.TenHienThi + "\n");

            return obj;
        }, {})

        return result;
    };

    groups_by_id(group_to_values) {
        const result = Object.keys(group_to_values).map(function (key) {
            return { MaPhong: key, TenHienThi: group_to_values[key] };
        })

        return result;
    };
}
