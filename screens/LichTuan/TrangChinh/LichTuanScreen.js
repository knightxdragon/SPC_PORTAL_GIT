import React, { Component } from 'react';
import moment from 'moment';
import DateTimePicker from "react-native-modal-datetime-picker";

import Config from '../../../class/Config';
import { CurrentDate } from '../../../components/CurrentDate';
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

import TabAll from './TabLichTuan/TabAll';
import TabLanhDao from './TabLichTuan/TabLanhDao';
import TabPhongBan from './TabLichTuan/TabPhongBan';
import TabCaNhan from './TabLichTuan/TabCaNhan';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';

export default class LichTuanScreen extends Component {
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
            headerTitle: 'Lịch tuần',
            headerRight: () => (
                <Button appearance='ghost' status='primary' onPress={() => navigation.navigate('DuyetLichTuan')}>Duyệt lịch</Button>
            ),
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
                                <Layout style={{ width: percentWidthArrow + "%" }}>
                                    <Button appearance='ghost' status='info' icon={() => { return <IK.ArrowLeft {...styleArrow} /> }} onPress={() => this.descreaseDate()}>
                                    </Button>
                                </Layout>
                                <Layout style={{ width: percentCenter + "%", alignItems: 'center' }}>
                                    <Layout style={Styles.flexDirectionRow}>
                                        <Layout style={Styles.justifyCenter}>
                                            <Text status='danger' category='h6' >{CurrentDate(valueDate, true)}</Text>
                                        </Layout>
                                        <Layout style={Styles.justifyCenter}>
                                            <Button appearance='ghost' status='danger' size='giant' onPress={this.showDateTimePicker}>
                                                {'Ngày ' + displayDate}
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
                            onSelect={(i) => { this.setState({ selectedIndex: i }) }}
                            style={Styles.tabView}
                        >
                            <Tab title="Tất cả" icon={IK.Layers}>
                                <TabAll parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} isMounted={this._isMounted} />
                            </Tab>
                            <Tab title="Lãnh đạo" icon={IK.PersonDone}>
                                <TabLanhDao parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} isMounted={this._isMounted} />
                            </Tab>
                            <Tab title="Phòng ban" icon={IK.Cube}>
                                <TabPhongBan parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} isMounted={this._isMounted} />
                            </Tab>
                            <Tab title="Cá nhân" icon={IK.Person}>
                                <TabCaNhan parDate={valueDate} parUserId={this.state.userID} parNavigation={this.props.navigation} isMounted={this._isMounted} />
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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

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