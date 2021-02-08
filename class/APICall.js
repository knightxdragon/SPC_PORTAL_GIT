import Session from '../components/Session';
import ToastMessage from './ToastMessage';

export default class APICall {
    static errorMess = 'Đã có lỗi xảy ra';
    
    static callPostData = (url, data) => {
        const res = Session.getUserInfo().then((goals) => {
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'CTTNB ' + goals.TokenAut
                }
            })
                .then(function (response) {
                    if (!response.ok) {
                        if (response.status != 404) {
                            if (!url.includes('LT_GetLichTuanDanhSachFile') && !url.includes('GS_CongViecGetFile')) {
                                ToastMessage.showDanger(APICall.errorMess);
                            }

                            console.log("response = " + JSON.stringify(response));

                            return response;
                        }
                    }

                    return response.json();
                })
                .then((responseAsJson) => {
                    return responseAsJson;
                })
                .catch(function (error) {
                    ToastMessage.showDanger(error);
                    console.log(error);
                });
        })

        return res;
    }

    static callPostNoData = (url) => {
        const res = Session.getUserInfo().then((goals) => { 
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'CTTNB ' + goals.TokenAut
                }
            })
                .then(function (response) {
                    if (!response.ok) {
                        if (response.status != 404) {
                            if (!url.includes('LT_GetLichTuanDanhSachFile') && !url.includes('GS_CongViecGetFile')) {
                                ToastMessage.showDanger(APICall.errorMess);
                            }
    
                            console.log("response = " + JSON.stringify(response));
                            return response;
                        }
                    }
    
                    return response.json();
                })
                .then((responseAsJson) => {
                    return responseAsJson;
                })
                .catch(function (error) {
                    ToastMessage.showDanger(error);
                    console.log(error);
                });
        })

        return res;
    }

    static callPostNoAuthentication = (url) => {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (!response.ok) {
                    if (response.status != 404) {
                        if (!url.includes('LT_GetLichTuanDanhSachFile') && !url.includes('GS_CongViecGetFile')) {
                            ToastMessage.showDanger(APICall.errorMess);
                        }

                        console.log("response = " + JSON.stringify(response));
                        return response;
                    }
                }

                return response.json();
            })
            .then((responseAsJson) => {
                return responseAsJson;
            })
            .catch(function (error) {
                ToastMessage.showDanger(error);
                console.log(error);
            });
    }
}
