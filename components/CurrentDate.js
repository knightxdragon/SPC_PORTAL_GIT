import React from 'react';
import { Text } from 'react-native';
import moment from 'moment';

export function CurrentDate(valueDate, dayMode) {// Biến lưu tên của thứ
    let curDate = valueDate;
    let day = moment(curDate).day();
    let fullDate = moment(curDate).format('DD/MM/YYYY');
    let day_name = '';
    let ngay = " - Ngày ";

    // Lấy tên thứ của ngày hiện tại
    switch (day) {
        case 0:
            day_name = "Chủ nhật";
            break;
        case 1:
            day_name = "Thứ 2";
            break;
        case 2:
            day_name = "Thứ 3";
            break;
        case 3:
            day_name = "Thứ 4";
            break;
        case 4:
            day_name = "Thứ 5";
            break;
        case 5:
            day_name = "Thứ 6";
            break;
        case 6:
            day_name = "Thứ 7";
    }

    if (dayMode) {
        return `${day_name}`;
    }
    else {
        return `${day_name}${ngay}${fullDate}`
    }
    
}
