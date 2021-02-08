import React, { useState } from "react";
import { SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import CapNhatDuyetScreen from '../screens/LichTuan/TrangChinh/TabDuyetLichTuan/CapNhatDuyetScreen';
import ChiTietCongViecScreen from '../screens/CongViec/ChiTietCongViec/ChiTietCongViecScreen';
import ChiTietLichTuanScreen from '../screens/LichTuan/ChiTiet/ChiTietLichTuanScreen';
import ChiTietPhienHopScreen from '../screens/CongViec/ChiTietPhienHop/ChiTietPhienHopScreen';
import DanhSachCongViecScreen from '../screens/CongViec/DanhSachCongViecScreen';
import DuyetLichTuanScreen from '../screens/LichTuan/TrangChinh/DuyetLichTuanScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import LichTuanScreen from '../screens/LichTuan/TrangChinh/LichTuanScreen';
import PhanCongCongViecScreen from '../screens/CongViec/ChiTietPhienHop/PhanCongCongViecScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ThemThanhPhanScreen from '../screens/LichTuan/ChiTiet/ThemThanhPhanScreen';
import ThongBaoScreen from '../screens/ThongBaoScreen';
import TongHopCongViecScreen from '../screens/CongViec/TongHopCongViecScreen';

import * as IK from '../components/IconKitten';
import NotifyBarIcon from '../components/NotifyBarIcon';

import {
  BottomNavigation,
  BottomNavigationTab,
} from '@ui-kitten/components';

const BottomTab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const LichTuanStack = createStackNavigator();
const ThongBaoStack = createStackNavigator();
const TongHopCongViecStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={HomeScreen.navigationOptions} />
      <HomeStack.Screen name="ChiTietCongViec" component={ChiTietCongViecScreen} options={{ headerTitle: 'Chi tiết công việc' }} />
      <HomeStack.Screen name="ChiTietLichTuan" component={ChiTietLichTuanScreen} options={{ headerTitle: 'Chi tiết lịch tuần' }} />
      <HomeStack.Screen name="PhanCongCongViec" component={PhanCongCongViecScreen} options={PhanCongCongViecScreen.navigationOptions} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: 'Hồ sơ cá nhân' }} />
      <LichTuanStack.Screen name="ThemThanhPhan" component={ThemThanhPhanScreen} options={ThemThanhPhanScreen.navigationOptions} />
    </HomeStack.Navigator>
  );
}

function LichTuanStackScreen() {
  return (
    <LichTuanStack.Navigator>
      <LichTuanStack.Screen name="LichTuan" component={LichTuanScreen} options={LichTuanScreen.navigationOptions} />
      <LichTuanStack.Screen name="CapNhatDuyet" component={CapNhatDuyetScreen} />
      <LichTuanStack.Screen name="ChiTietLichTuan" component={ChiTietLichTuanScreen} options={{ headerTitle: 'Chi tiết lịch tuần' }} />
      <LichTuanStack.Screen name="DuyetLichTuan" component={DuyetLichTuanScreen} options={{ headerTitle: 'Duyệt lịch tuần' }} />
      <LichTuanStack.Screen name="ThemThanhPhan" component={ThemThanhPhanScreen} options={ThemThanhPhanScreen.navigationOptions} />
    </LichTuanStack.Navigator>
  );
}

function ThongBaoStackScreen() {
  return (
    <ThongBaoStack.Navigator>
      <ThongBaoStack.Screen name="ThongBao" component={ThongBaoScreen} options={{ headerTitle: 'Thông báo' }} />
      <ThongBaoStack.Screen name="ChiTietLichTuan" component={ChiTietLichTuanScreen} options={{ headerTitle: 'Chi tiết lịch tuần' }} />
    </ThongBaoStack.Navigator>
  );
}

function TongHopCongViecStackScreen() {
  return (
    <TongHopCongViecStack.Navigator>
      <TongHopCongViecStack.Screen name="TongHopCongViec" component={TongHopCongViecScreen} options={{ headerTitle: 'Tổng hợp' }} />
      <TongHopCongViecStack.Screen name="ChiTietCongViec" component={ChiTietCongViecScreen} options={{ headerTitle: 'Chi tiết công việc' }} />
      <TongHopCongViecStack.Screen name="ChiTietPhienHop" component={ChiTietPhienHopScreen} options={{ headerTitle: 'Chi tiết phiên họp' }} />
      <TongHopCongViecStack.Screen name="CongViec" component={DanhSachCongViecScreen} options={{ headerTitle: 'Công việc' }} />
      <TongHopCongViecStack.Screen name="PhanCongCongViec" component={PhanCongCongViecScreen} options={PhanCongCongViecScreen.navigationOptions} />
    </TongHopCongViecStack.Navigator>
  );
}

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  //navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  const [isSelected, setIsSelected] = useState(false); // dùng để kiểm tra có chọn tab thông báo?

  const BottomTabBar = ({ navigation, state }) => {
    const onSelect = (index) => {
      if (index == 3) {
        setIsSelected(true);
      }
      else {
        setIsSelected(false);
      }

      navigation.navigate(state.routeNames[index]);
    };

    return (
      <SafeAreaView style={{ backgroundColor: '#fff' }}>
        <BottomNavigation selectedIndex={state.index} onSelect={onSelect} style={{ borderTopColor: '#dedede', borderTopWidth: 1 }}>
          <BottomNavigationTab title='Trang chủ' icon={IK.Person} />
          <BottomNavigationTab title='Lịch tuần' icon={IK.Calendar} />
          <BottomNavigationTab title='Công việc' icon={IK.Folder} />
          <BottomNavigationTab title='Thông báo' icon={() => { return <NotifyBarIcon select={isSelected} />}} />
        </BottomNavigation>
      </SafeAreaView>
    );
  };

  return (
    <BottomTab.Navigator tabBar={props => <BottomTabBar {...props} />}>
      <BottomTab.Screen name="Home" component={HomeStackScreen} />
      <BottomTab.Screen name="LichTuan" component={LichTuanStackScreen} />
      <BottomTab.Screen name="TongHopCongViec" component={TongHopCongViecStackScreen} />
      <BottomTab.Screen name="ThongBao" component={ThongBaoStackScreen} />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'CTTNB EVNSPC';
    case 'LichTuan':
      return 'Lịch tuần';
    case 'ThongBao':
      return 'Thông báo';
    case 'TongHopCongViec':
      return 'Công việc';
    case 'Settings':
      return 'Cài đặt';
  }
}