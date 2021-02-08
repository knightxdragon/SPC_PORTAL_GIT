import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import NotifyBarIcon from '../components/NotifyBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LichTuanScreen from '../screens/LichTuan/TrangChinh/LichTuanScreen';
import DuyetLichTuanScreen from '../screens/LichTuan/TrangChinh/DuyetLichTuanScreen';
import ChiTietLichTuanScreen from '../screens/LichTuan/ChiTiet/ChiTietLichTuanScreen';
import ThongBaoScreen from '../screens/ThongBaoScreen';
import ChiTietCongViecScreen from '../screens/CongViec/ChiTietCongViec/ChiTietCongViecScreen';
import DangKyLichTuanScreen from '../screens/LichTuan/TrangChinh/DangKyLichTuanScreen';
import ThemThanhPhanScreen from '../screens/LichTuan/ChiTiet/ThemThanhPhanScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CapNhatDuyetScreen from '../screens/LichTuan/TrangChinh/TabDuyetLichTuan/CapNhatDuyetScreen';
import DanhSachCongViecScreen from '../screens/CongViec/DanhSachCongViecScreen';
import ChiTietPhienHopScreen from '../screens/CongViec/ChiTietPhienHop/ChiTietPhienHopScreen';
import PhanCongCongViecScreen from '../screens/CongViec/ChiTietPhienHop/PhanCongCongViecScreen';

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'CTTNB EVNSPC'
    }
  }
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Trang chủ',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'home'}
    />
  ),
};

const LichTuanStack = createStackNavigator({
  LichTuan: {
    screen: LichTuanScreen,
    navigationOptions: {
      title: 'Lịch tuần'
    }
  },
  DuyetLichTuan: {
    screen: DuyetLichTuanScreen,
    navigationOptions: {
      title: 'Duyệt lịch tuần'
    }
  },
  ChiTietLichTuan: {
    screen: ChiTietLichTuanScreen,
    navigationOptions: {
      title: 'Chi tiết lịch tuần'
    }
  },
  DangKyLichTuan: {
    screen: DangKyLichTuanScreen,
    navigationOptions: {
      title: 'Đăng ký lịch tuần'
    }
  },
  ThemThanhPhan: {
    screen: ThemThanhPhanScreen,
    navigationOptions: {
      title: 'Thêm thành phần tham dự'
    }
  },
  CapNhatDuyet: {
    screen: CapNhatDuyetScreen,
    navigationOptions: {
      title: 'Cập nhật lịch tuần'
    }
  }
});

LichTuanStack.navigationOptions = {
  tabBarLabel: 'Lịch tuần',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'calendar'}
    />
  ),
};

const ThongBaoStack = createStackNavigator({
  ThongBao: {
    screen: ThongBaoScreen,
    navigationOptions: {
      title: 'Thông báo'
    }
  },
});

ThongBaoStack.navigationOptions = {
  tabBarLabel: 'Thông báo',
  tabBarIcon: ({ focused }) => (
    <NotifyBarIcon name={'notifications'} focused={focused} />
  ),
};

// const GSCVStack = createStackNavigator({
//   MainGSCV: { screen: MainGSCV },
//   DanhSachMain: { screen: DanhSachMain },
//   ChiTietThongBao: {
//     screen: ChiTietThongBaoScreen,
//     navigationOptions: {
//       title: 'Chi tiết thông báo'
//     }
//   },
//   ChiTietCongViec: {
//     screen: ChiTietCongViecScreen,
//     navigationOptions: {
//       title: 'Chi tiết công việc'
//     }
//   },
// });

// GSCVStack.navigationOptions = {
//   tabBarLabel: 'Công việc',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={'desktop'}
//     />
//   ),
// };

const CongViecStack = createStackNavigator({
  CongViec: {
    screen: DanhSachCongViecScreen,
    navigationOptions: {
      title: 'Công việc'
    }
  },
  ChiTietPhienHop: {
    screen: ChiTietPhienHopScreen,
    navigationOptions: {
      title: 'Chi tiết phiên họp'
    }
  },
  ChiTietCongViec: {
    screen: ChiTietCongViecScreen,
    navigationOptions: {
      title: 'Chi tiết công việc'
    }
  },
  PhanCongCongViec: {
    screen: PhanCongCongViecScreen,
    navigationOptions: {
      title: 'Chi tiết công việc'
    }
  },
});

CongViecStack.navigationOptions = {
  tabBarLabel: 'Công việc',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'desktop'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: 'Cài đặt'
    }
  }
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Cài đặt',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'cog'}
    />
  ),
};

const NotifiStack = createStackNavigator({
  Notifi: {
    screen: NotificationScreen,
    navigationOptions: {
      title: 'Notifi'
    }
  }
});

NotifiStack.navigationOptions = {
  tabBarLabel: 'Notifi',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'cog'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LichTuanStack,
  ThongBaoStack,
  CongViecStack,
  SettingsStack,
});
