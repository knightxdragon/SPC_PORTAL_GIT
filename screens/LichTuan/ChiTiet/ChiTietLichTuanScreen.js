import React, { Component } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

import * as IK from '../../../components/IconKitten';
import Styles from '../../Styles';

import {
    Layout,
    Tab,
    TabView,
} from '@ui-kitten/components';

import TabThongTin from './TabThongTin';
import TabThanhPhan from './TabThanhPhan';
import TabTaiLieu from './TabTaiLieu';

export default function (props) {
    const route = useRoute();
    const navigation = useNavigation();

    return <ChiTietLichTuanScreen {...props} route={route} navigation={navigation} />;
}

class ChiTietLichTuanScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        }
    }

    render() {
        const { route } = this.props;
        const { navigation } = this.props;
        const valuedID = route.params.IDLich;

        return (
            <Layout style={Styles.flexFull}>
                <TabView
                    selectedIndex={this.state.selectedIndex}
                    onSelect={(i) => { this.setState({ selectedIndex: i }) }}
                    style={Styles.tabView}
                >
                    <Tab title="Thông tin" icon={IK.Info}>
                        {/* đặt tên biến để truyền tham số cho component con */}
                        <TabThongTin parIDLich={valuedID} />
                    </Tab>
                    <Tab title="CBCNV Tham dự" icon={IK.People}>
                        <TabThanhPhan parIDLich={valuedID} parNavigation={navigation} />
                    </Tab>
                    <Tab title="Tài liệu họp" icon={IK.Archive}>
                        <TabTaiLieu parIDLich={valuedID} />
                    </Tab>
                </TabView>
            </Layout>
        )
    }
}