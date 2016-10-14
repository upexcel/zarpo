import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DateService {
    constructor() {
    }
    currentMonth() {
        var currentMonth = "";
        var dateObj = new Date();
        var m: any = dateObj.getMonth() + 1;
        if (m < 10)
            m = "0" + m;
        var y = dateObj.getFullYear();
        currentMonth = y + "-" + m;
        return Promise.resolve(currentMonth);
    }
    currentHumanDate() {
        var currentDate = "";
        var dateObj = new Date();
        var d: any = dateObj.getDate();
        if (d < 10)
            d = "0" + d;
        var m: any = dateObj.getMonth() + 1;
        if (m < 10)
            m = "0" + m;
        var y = dateObj.getFullYear();
        currentDate = y + "-" + m + "-" + d;
        return Promise.resolve(currentDate);
    }
    getNights(checkInDate: string, checkOutDate: string) {
        var oneDay_MS = 24 * 60 * 60 * 1000;
        var stay = Date.parse(checkOutDate) - Date.parse(checkInDate);
        var night = stay / oneDay_MS;
        return Promise.resolve(night);
    }
    getTomorrow() {
        var tomorrow = {};
        var dateObj = new Date();
        var d: any = dateObj.getDate();
        if (d < 10)
            d = "0" + d;
        var m: any = dateObj.getMonth() + 1;
        if (m < 10)
            m = "0" + m;
        var y = dateObj.getFullYear();

        tomorrow['year'] = y;
        tomorrow['month'] = m;
        tomorrow['date'] = d;

        return Promise.resolve(tomorrow);
    }
    nextDate(startDate: string) {
        var nextDate = "";
        var dateObj = new Date(startDate);
        dateObj.setDate(dateObj.getDate() + 1);
        var d: any = dateObj.getDate();
        if (d < 10)
            d = "0" + d;
        var m: any = dateObj.getMonth() + 1;
        if (m < 10)
            m = "0" + m;
        var y = dateObj.getFullYear();
        nextDate = y + "-" + m + "-" + d;
        return Promise.resolve(nextDate);
    }

}
