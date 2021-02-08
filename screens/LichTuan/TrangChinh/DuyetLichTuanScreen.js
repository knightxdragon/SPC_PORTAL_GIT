import React, { Component } from 'react';
import moment from 'moment';
import DateTimePicker from "react-native-modal-datetime-picker";

import Config from '../../../class/Config';
import * as IK from '../../../components/IconKitten';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Session from '../../../components/Session';
import Styles from '../../Styles';

import {
    Layout,
    Button,
    Tab,
    TabView,
    Text
} from '@ui-kitten/components';

import TabChuaDuyet from './TabDuyetLichTuan/TabChuaDuyet';
import TabTongHop from './TabDuyetLichTuan/TabTongHop';
import TabXuatBan from './TabDuyetLichTuan/TabXuatBan';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';

export default class DuyetLichTuanScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curDate: moment().add(1, 'week'),
            userID: null,
            loading: true,
            isDateTimePickerVisible: false,
            currentTab: null
        }
    }

    render() {
        var standardDate = moment.utc(this.state.curDate, fmtVI).local();
        var nextWeek = standardDate;
        var valueDate = nextWeek.format(fmtEN);

        // Lấy giá trị tuần tới
        var fromDate = nextWeek.weekday(0).format('DD-MM'); // ngày thứ 2
        var toDate = nextWeek.weekday(4).format('DD-MM'); // ngày thứ 6
        //---

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
                                <Layout style={{ width: percentWidthArrow + "%" }}>
                                    <Button appearance='ghost' status='info' icon={() => { return <IK.ArrowLeft {...styleArrow} /> }} onPress={() => this.descreaseDate()}>
                                    </Button>
                                </Layout>
                                <Layout style={{ width: percentCenter + "%", alignItems: 'center' }}>
                                    <Layout style={Styles.flexDirectionRow}>
                                        <Layout style={Styles.justifyCenter}>
                                            <Text status='danger' category='h6'>Tuần</Text>
                                        </Layout>
                                        <Layout style={Styles.justifyCenter}>
                                            <Button appearance='ghost' status='danger' size='giant' onPress={this.showDateTimePicker} style={{ paddingHorizontal: 2, marginHorizontal: 2 }}>
                                                {fromDate} / {toDate}
                                            </Button>
                                            <DateTimePicker
                                                locale="vi_VI"
                                                date={initDate}
                                                isVisible={this.state.isDateTimePickerVisible}
                                                onConfirm={this.handleDatePicked}
                                                onCancel={this.hideDateTimePicker}
                                            />
                                        </Layout>
                                    </Layout>
                                </Layout>
                                <Layout style={{ width: percentWidthArrow + "%" }}>
                                    <Button appearance='ghost' status='info' icon={() => { return <IK.ArrowRight {...styleArrow} /> }} onPress={() => this.increaseDate()}>
                                    </Button>
                                </Layout>
                            </Layout>
                        </Layout>
                    </Layout>
                    <Layout style={Styles.flexFull}>
                        <TabView
                            selectedIndex={this.state.selectedIndex}
                            //shouldLoadComponent={(i) => this.loadComponent(i)}
                            onSelect={(i) => { this.setState({ selectedIndex: i }) }}
                            style={Styles.tabView}
                        >
                            <Tab title="Chưa duyệt" icon={IK.FlashOff}>
                                {/* đặt tên biến để truyền tham số cho component con */}
                                <TabChuaDuyet parRef={this.state.selectedIndex} parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} />
                            </Tab>
                            <Tab title="Tổng hợp" icon={IK.Flash}>
                                <TabTongHop parRef={this.state.selectedIndex} parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} />
                            </Tab>
                            <Tab title="Xuất bản" icon={IK.PaperPlane}>
                                <TabXuatBan parRef={this.state.selectedIndex} parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} />
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

    loadComponent(value) {
        if (value == this.state.selectedIndex) {
            setInterval(() => { return true }, 200)
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ select: this.state.selected });

        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId,
                loading: false
            })
        });
    }

    descreaseDate() {
        this.setState(prevState => ({
            curDate: moment(prevState.curDate, fmtVI).subtract(7, 'day')
        }));
    }

    increaseDate() {
        this.setState(prevState => ({
            curDate: moment(prevState.curDate, fmtVI).add(7, 'day')
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
