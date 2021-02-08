import React, { Component } from 'react';
import { ScrollView, Platform } from 'react-native';

import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';

import APICall from '../../../class/APICall';
import Config from '../../../class/Config';
import ErrorMessage from '../../../class/ErrorMessage';
import * as IK from '../../../components/IconKitten';
import ModalLogin from '../../../components/ModalLogin';
import MyActivityIndicator from '../../../components/MyActivityIndicator';
import Session from '../../../components/Session';
import Styles from '../../Styles';
import TextMessage from '../../../class/TextMessage';

import {
    Layout,
    Button
} from '@ui-kitten/components';

export default class TabTaiLieu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getParentIDLich: this.props.parIDLich, // lấy tham số ngày từ component cha
            dataSource: [], // lưu trữ dữ liệu json
            userID: null,
            loading: true,
            visible: false
        }
    }

    conditionRender() {
        let dataS = this.state.dataSource;

        if (dataS != null) {
            if (dataS.length > 0) {
                return this.state.dataSource.map((item, key) => (
                    <Layout style={Styles.lt_time} key={key}>
                        <Button appearance='outline' status='info' icon={IK.Download} onPress={() => { this.downloadFile(item.FileID) }}>
                            {item.FileName}
                        </Button>
                    </Layout>
                ))
            }
            else
                return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOTAILIEU);
        }
        else
            return TextMessage.TextWarning(ErrorMessage.ERROR_KHONGCOTAILIEU);
    }

    render() {
        if (!this.state.loading) {
            return (
                <Layout style={Styles.flexFullContent}>
                    <ScrollView>
                        {this.conditionRender()}
                    </ScrollView>
                    <ModalLogin visible={this.state.visible} />
                </Layout>
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
            }, () => {
                this.fetchData(null);
            })
        });
    }

    async downloadFile(idFile) {
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanTaiFile';
        var data = {
            FileID: idFile
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
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
    }

    async openFile(url) {
        return await WebBrowser.openBrowserAsync(url);
    }

    fetchData(valueID) {
        const realID = valueID != null ? valueID : this.state.getParentIDLich;
        var url = Config.BASE_URL + Config.API_LICHTUAN + 'LT_GetLichTuanDanhSachFile';
        var data = {
            IDLich: realID,
            //UserId: this.state.userID
        };

        APICall.callPostData(url, data).then((responseAsJson) => {
            if (typeof responseAsJson.status !== 'undefined') {
                if (responseAsJson.status === 401) { // Invalid token
                    this.setState({
                        visible: true,
                        loading: false
                    })
                }
            }
            else {
                this.setState({
                    dataSource: responseAsJson,
                    loading: false
                });
            }
        })
    }
}
