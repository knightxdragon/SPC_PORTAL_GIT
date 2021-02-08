import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, Dimensions, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Form, Item, Input, Label, Button, Picker, Title, Footer, FooterTab, Text, View, Tabs, Tab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';
// import MonthSelectorCalendar from 'react-native-year';
// import YearMonthPicker from "../../components/yearMonthPicker";
import DateTimePicker from "react-native-modal-datetime-picker";
import MyActivityIndicator from '../../components/MyActivityIndicator';
import Session from '../../components/Session';
import TabAll_GSCV from './3TabAll_GSCV';
import IconZ from '../../components/IconZ';
import Styles from '../Styles';
import { CurrentDate } from '../../components/CurrentDate';

const fmtVI = 'MM-YYYY';
const fmtEN = 'YYYY-MM-DD';
const sizeIcon = 34;

export default class DanhSachMain extends Component {
    static navigationOptions = ({ navigation }) => {
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        return {
            title: 'Danh sách ' + navigation.getParam('title', 'NO-ID') + ' đến tháng ' + month + '/' + year,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            curDate: moment(),
            userID: null,
            loading: true,
            isDateTimePickerVisible: false
        }
    }

    render() {
        const standardDate = moment.utc(this.state.curDate, fmtVI).local();
        const valueDate = standardDate.format(fmtEN);
        const displayDate = standardDate.format(fmtVI);
        const { navigation } = this.props;
        const valuedID = navigation.getParam('idDT');

        if (!this.state.loading) {
            return (
                <Container>
                    <Content>
                        <Grid>
                            <Row style={Styles.lt_calendar}>
                                <Col style={Styles.lt_colNav}>
                                    <Button full transparent onPress={() => this.descreaseDate()}>
                                        <Label style={Styles.lt_iconNav}><IconZ name='arrow-back' size={sizeIcon} /></Label>
                                    </Button>
                                </Col>
                                <Col>
                                    <Button title="Show DatePicker" onPress={this.showDateTimePicker} block light transparent style={Styles.dn_viewButton}>
                                        <Text>
                                            {displayDate}
                                        </Text>
                                    </Button>
                                    <DateTimePicker
                                        isVisible={this.state.isDateTimePickerVisible}
                                        onConfirm={this.handleDatePicked}
                                        onCancel={this.hideDateTimePicker}
                                    />
                                </Col>
                                <Col style={Styles.lt_colNav}>
                                    <Button full transparent onPress={() => this.increaseDate()}>
                                        <Label style={Styles.lt_iconNav}><IconZ name='arrow-forward' size={sizeIcon} /></Label>
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Tabs>
                                        {/* <Tab heading="Tất cả">
                                            <TabAll_GSCV parDate={valueDate} parType={""} parIDDT={valuedID} />
                                        </Tab> */}
                                        <Tab heading="Đang">
                                            <TabAll_GSCV parDate={valueDate} parType={"00CHT"} parIDDT={valuedID} />
                                        </Tab>
                                        <Tab heading="Đã">
                                            <TabAll_GSCV parDate={valueDate} parType={"01DHT"} parIDDT={valuedID} />
                                        </Tab>
                                        <Tab heading="Quá hạn">
                                            <TabAll_GSCV parDate={valueDate} parType={"00QHN"} parIDDT={valuedID} />
                                        </Tab>
                                        {/* <Tab heading="HT Quá hạn">
                                            <TabAll_GSCV parDate={valueDate} parType={"01HTQ"} parIDDT={valuedID} />
                                        </Tab> */}
                                    </Tabs>
                                </Col>
                            </Row>
                        </Grid>
                    </Content>
                </Container>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    componentDidMount() {
        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId,
                loading: false
            })
        });
    }

    descreaseDate() {
        this.setState(prevState => ({
            curDate: moment(prevState.curDate, fmtVI).subtract(1, 'month')
        }));
    }

    increaseDate() {
        this.setState(prevState => ({
            curDate: moment(prevState.curDate, fmtVI).add(1, 'month')
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

const styles = StyleSheet.create({
    lbNav: {
        textAlign: "center"
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    showPickerBtn: {
        height: 44,
        backgroundColor: '#973BC2',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    yearMonthText: {
        fontSize: 20,
        marginTop: 12
    }
});