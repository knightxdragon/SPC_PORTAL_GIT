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
import TabBaoCao from './TabBaoCao';

export default function (props) {
    const route = useRoute();
    const navigation = useNavigation();

    return <ChiTietCongViecScreen {...props} route={route} navigation={navigation} />;
}

class ChiTietCongViecScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        }
    }

    render() {
        const { route } = this.props;
        const { navigation } = this.props;
        const valuedID = route.params.MaCongViec;
        const valuedVaiTro = route.params.VaiTro;
        const valuedLoaiPC = route.params.LoaiPC;

        return (
            <Layout style={Styles.flexFull}>
                <TabView
                    selectedIndex={this.state.selectedIndex}
                    onSelect={(i) => { this.setState({ selectedIndex: i }) }}
                    style={Styles.tabView}
                >
                    <Tab title="Chi tiết" icon={IK.Info}>
                        <TabThongTin parMaCongViec={valuedID} parVaiTro={valuedVaiTro} parNavigation={navigation} />
                    </Tab>
                    <Tab title="Công việc con" icon={IK.List}>
                        <TabThanhPhan parMaCongViec={valuedID} />
                    </Tab>
                    <Tab title="File đính kèm" icon={IK.Attach}>
                        <TabTaiLieu parMaCongViec={valuedID} />
                    </Tab>
                    <Tab title="Báo cáo" icon={IK.FileText}>
                        <TabBaoCao parMaCongViec={valuedID} parLoaiPC={valuedLoaiPC} />
                    </Tab>
                </TabView>
            </Layout>
        )
    }
}
