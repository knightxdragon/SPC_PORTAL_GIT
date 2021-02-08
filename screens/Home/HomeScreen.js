import React, { Component } from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import moment from 'moment';
import DateTimePicker from "react-native-modal-datetime-picker";
import * as Notifications from 'expo-notifications';

import Config from '../../class/Config';
import { CurrentDate } from '../../components/CurrentDate';
import * as IK from '../../components/IconKitten';
import MyActivityIndicator from '../../components/MyActivityIndicator';
import Session from '../../components/Session';
import Styles from '../Styles';

import {
    Avatar,
    Layout,
    Button,
    Tab,
    TabView,
    Text
} from '@ui-kitten/components';

import TabAll from './TabTrangChu/TabAll';
import TabCaNhan from './TabTrangChu/TabCaNhan';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default class HomeScreen extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            curDate: moment(),
            userID: null,
            loading: true,
            isDateTimePickerVisible: false,
            selectedIndex: 0,
            mode: 'date',
            showPicker: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Trang chủ',
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Avatar style={{ marginRight: 20 }} size='tiny' source={require('../../assets/person.png')} />
                </TouchableOpacity>
            )
        };
    };

    render() {
        var standardDate = moment.utc(this.state.curDate, fmtVI).local();
        var valueDate = standardDate.format(fmtEN);
        var displayDate = standardDate.format(fmtVI);
        var initDate = new Date(moment(this.state.curDate).format(fmtEN));
        let percentWidthArrow = 15;
        let percentCenter = 100 - (percentWidthArrow * 2);
        const sizeIcon = 32;

        let styleArrow = {
            width: sizeIcon,
            height: sizeIcon,
            fill: Config.MAU_XANH_EVN
        }

        if (!this.state.loading) {
            return (
                <Layout style={Styles.flexFull}>
                    <Layout style={Styles.lt_calendar}>
                        <Layout style={Styles.lt_colNav}>
                            <Layout style={Styles.flexDirectionRow}>
                                <Layout style={{ width: percentCenter + "%", alignItems: 'center' }}>
                                    <Layout style={Styles.flexDirectionRow}>
                                        <Layout style={Styles.justifyCenter}>
                                            <Text status='danger' category='h6' >{CurrentDate(valueDate, true)}</Text>
                                        </Layout>
                                        <Layout style={Styles.justifyCenter}>
                                            <Button appearance='ghost' status='danger' size='giant' onPress={this.showDateTimePicker}>
                                                {'Ngày ' + displayDate}
                                            </Button>
                                        </Layout>
                                    </Layout>
                                </Layout>
                            </Layout>
                        </Layout>
                    </Layout>
                    <Layout style={Styles.flexFull}>
                        <TabView
                            selectedIndex={this.state.selectedIndex}
                            onSelect={(i) => { this.setState({ selectedIndex: i }) }}
                            style={Styles.tabView}
                        >
                            <Tab title="Tất cả" icon={IK.Layers}>
                                <TabAll parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} isMounted={this._isMounted} />
                            </Tab>
                            <Tab title="Cá nhân" icon={IK.Person}>
                                <TabCaNhan parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} isMounted={this._isMounted} />
                            </Tab>
                            <Tab title="EVN" icon={IK.Globe}>
                                <Button style={{ marginTop: 20 }} onPress={() => {
                                    Linking.openURL('http://lichtuan.evn.vn/')
                                        .catch(err => {
                                            console.error("Failed opening page because: ", err)
                                            alert('Failed to open page')
                                        })
                                }
                                }>
                                    Nhấn vào đây để chuyển đến trang EVN
                                </Button>
                            </Tab>
                        </TabView>
                    </Layout>
                </Layout>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.navigation.setParams({ select: this.state.selected });

        Session.getUserInfo().then((goals) => {
            if (this._isMounted) {
                this.setState({
                    userID: goals.UserId,
                    loading: false
                })
            }
        });

        // Hàm lắng nghe notification
        Notifications.addNotificationReceivedListener(this._handleNotification);
        Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _handleNotificationResponse = response => {
        console.log(response);
    };

    _handleNotification = notification => {
        if (notification.origin === 'selected') { // khi người dùng nhấn vào notification trên system tray của điện thoại
            var item = notification.data;
            var getDate = moment();
            var curDate = moment.utc(getDate, fmtVI).local().format(fmtEN);
            var url = Config.BASE_URL + Config.API_EXPOPUSH + 'Expo_ReadNotification';
            var data = {
                NotifyID: item.NotifyID,
                ReadDate: curDate
            };

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    if (!response.ok) {
                        console.log("response = " + JSON.stringify(response));

                        return;
                    }

                    return response.json();
                })
                .then((responseAsJson) => {
                    if (this._isMounted) {
                        if (item.ModuledID == 'LT') { // Module Lịch Tuần
                            this.props.navigation.navigate("ChiTietLichTuan", { IDLich: item.Item });
                        }
                        else {
                            this.props.navigation.navigate("ChiTietCongViec", { MaCongViec: item.Item });
                        }
                    }
                })
                .catch(function (error) {
                    console.log('Lỗi = ' + error);
                });
        }
    };

    descreaseDate() {
        this.setState(prevState => ({
            curDate: moment(prevState.curDate, fmtVI).subtract(1, 'day')
        }));
    }

    increaseDate() {
        this.setState(prevState => ({
            curDate: moment(prevState.curDate, fmtVI).add(1, 'day')
        }));
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        this.setState({
            curDate: date
        })

        this.hideDateTimePicker();
    };
}