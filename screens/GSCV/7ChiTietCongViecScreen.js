import React, { Component } from 'react';
import { Container, Content, Tabs, Tab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import TabThongTin from './8TabThongTin';
import TabThanhPhan from './9TabThanhPhan';
import TabTaiLieu from './10TabTaiLieu';
import TabBaoCao from './11TabBaoCao';

export default class ChiTietCongViecScreen extends Component {
    render() {
        const { navigation } = this.props;
        const valuedID = navigation.getParam('MaCongViec');

        return (
            <Container>
                <Content>
                    <Grid>
                        <Row>
                            <Col>
                                <Tabs>
                                    <Tab heading="Chi tiết">
                                        {/* đặt tên biến để truyền tham số cho component con */}
                                        <TabThongTin parMaCongViec={valuedID} />
                                    </Tab>
                                    <Tab heading="Công việc con">
                                        <TabThanhPhan parMaCongViec={valuedID} />
                                    </Tab>
                                    <Tab heading="Tập tin đính kèm">
                                        <TabTaiLieu parMaCongViec={valuedID} />
                                    </Tab>
                                    <Tab heading="Báo cáo">
                                        <TabBaoCao parMaCongViec={valuedID} />
                                    </Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        )
    }
}
