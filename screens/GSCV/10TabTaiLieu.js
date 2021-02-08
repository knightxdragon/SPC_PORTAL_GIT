import React, { Component } from 'react'
import { Text, View, Linking } from 'react-native'
import MyActivityIndicator from '../../components/MyActivityIndicator';
import Config from '../../class/Config';
import ErrorMessage from '../../class/ErrorMessage';
import Session from '../../components/Session';
import { Button } from 'native-base';
import Styles from '../Styles';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';
import IconZ from '../../components/IconZ';
import { Card, CardItem } from 'native-base';

const fmtVI = 'DD-MM-YYYY';
const fmtEN = 'YYYY-MM-DD';
const sizeIcon = 34;

export default class TabTaiLieu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getParentMaCongViec: this.props.parMaCongViec, // lấy tham số ngày từ component cha
            dataSource: [], // lưu trữ dữ liệu json
            userID: null,
            loading: true
        }
    }

    conditionRender() {
        if (this.state.dataSource.length > 0) {
            return this.state.dataSource.map((item, key) => (
                <Card key={key}>
                    <CardItem>
                        <Button transparent onPress={() => { this.downloadFile(item.FileID) }}>
                            <Text style={Styles.ttl_fileName}><IconZ name="download" size={20} /> {item.FileName}</Text>
                        </Button>
                    </CardItem>
                </Card>
            ))
        }
        else {
            return <Text style={Styles.lbError}>{ ErrorMessage.ERROR_KHONGCOTAILIEU }</Text>
        }
    }

    render() {
        if (!this.state.loading) {
            return (
                <View style={Styles.content}>
                    {this.conditionRender()}
                </View>
            )
        }
        else {
            return <MyActivityIndicator />
        }
    }

    componentDidMount() {
        Session.getUserInfo().then((goals) => {
            this.setState({
                userID: goals.UserId
            })
            this.fetchData();
        });
    }

    async downloadFile(idFile) {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanTaiFile';
        var data = {
            FileID: idFile
        };
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (!response.ok) {
                    console.warn("response = " + JSON.stringify(response));
                }
                return response.json();
            })
            .then((responseAsJson) => {
                if (responseAsJson.length > 0) {
                    // const extention = responseAsJson[0].FileType.split("/");
                    if (Platform.OS === 'android') {
                        const nextUri = FileSystem.cacheDirectory + responseAsJson[0].FileName;
                        //const nextUri = FileSystem.cacheDirectory + "khoald.pdf";
                        FileSystem.writeAsStringAsync(nextUri, responseAsJson[0].FileData, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        FileSystem.getContentUriAsync(nextUri).then(cUri => {
                            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                                data: cUri.uri,
                                flags: 1
                            });
                        });
                    }
                    else {
                        const nextUriIOS = FileSystem.cacheDirectory + responseAsJson[0].FileName.replace(/\s/g, '-').replace(/[^\x00-\x7F]/g, "*");
                        //const nextUri = FileSystem.cacheDirectory + "khoald.pdf";
                        FileSystem.writeAsStringAsync(nextUriIOS, responseAsJson[0].FileData, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        Sharing.shareAsync(nextUriIOS);
                    }
                }
            })
            .catch(function (error) {
                alert('Lỗi = ' + error);
            });
    }

    fetchData() {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanDanhSachFile';
        var data = {
            IDLich: this.state.getParentIDLich,
            UserId: this.state.userID
        };

        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (!response.ok) {
                    console.warn("response = " + JSON.stringify(response));
                }

                return response.json();
            })
            .then((responseAsJson) => {
                this.setState({
                    dataSource: responseAsJson,
                    loading: false
                });
            })
            .catch(function (error) {
                alert('Lỗi = ' + error);
            });
    }
}
