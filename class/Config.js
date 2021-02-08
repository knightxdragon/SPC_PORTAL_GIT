export default class Config {
  static FLAG = 0; // 0: Debug, 1: Official, 2: QA
  static DEBUG_PATH = 'http://10.170.210.202:91/';
  static QA_PATH = 'http://10.170.210.201:84/';
  static OFFICIAL_PATH = 'https://home.evnspc.vn/API/';
  static BASE_URL = this.FLAG == 0 ? this.DEBUG_PATH : this.FLAG === 1 ? this.OFFICIAL_PATH : this.QA_PATH;
  static API_HETHONG = 'HeThong/';
  static API_LICHTUAN = 'LichTuan/';
  static API_GSCV = 'GiamSatCongViec/';
  static API_EXPOPUSH = 'ExpoPush/';
  static URL_BACKGROUND_APP = 'assets/images/background.jpg';
  static MAU_XANH_EVN = '#164397';
  static MAU_DO_EVN = '#ed1c23';
  static MAU_VANG_EVN = '#fff200';
}
