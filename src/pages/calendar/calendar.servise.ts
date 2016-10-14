import { Injectable, OnInit} from '@angular/core';
//import {Storage, LocalStorage} from 'ionic-angular';
import {Observable}     from 'rxjs/Observable';

import {LocalStorageService} from '../../services/local-storage.service';

@Injectable()
export class calendarService implements OnInit {
//    public local: LocalStorage;
    public oneDay_MS = 24 * 60 * 60 * 1000;
    ngOnInit() {

    }
    constructor(private _localStorageService: LocalStorageService) {
//        this.local = new Storage(LocalStorage);
    }
    changePerTimeZone(tempDate: any) {
        var test = new Date(tempDate);
        var now_hr = new Date().getHours();
        var now_min = new Date().getMinutes();
        var tempDate_str = tempDate.split("-");
        test.setDate(tempDate_str[2]);
        var newmonth = parseInt(tempDate_str[1]) - 1;
        test.setMonth(newmonth);
        test.setFullYear(tempDate_str[0]);
        test.setHours(now_hr);
        test.setMinutes(now_min);
        return test;

    }
    checkinMin(date: any) {
        //timestamp for first_checkin date returned from api
        var first_timestamp = this.changePerTimeZone(date).getTime();
        //timestamp for today
        var isja: boolean;
        var today_timestamp = new Date().getTime();
        var ifMonday = new Date().getDay();
        console.log('if monday',ifMonday);

        var valid_api_timestamp;
        var minday;
        //ja products
        this._localStorageService.getValue('is_ja').then((data) => {
            if (data) {
                var now_hr = new Date().getHours();
                //if time is post 18PM
                if (now_hr > 17 || ifMonday == 1)
                    minday = (today_timestamp) + (1 * this.oneDay_MS);
                else
                    minday = today_timestamp;
            }
            //hotel/zarpo products
            else {
                minday = today_timestamp + (2 * this.oneDay_MS);
            }
            if (minday > first_timestamp)
                return minday;
            else
                return first_timestamp;
        });
    }
    public month: any;
    public tdate: any;
    timeToDate(timeStapm: any) {

        var keyDate = new Date(timeStapm);
        var year = keyDate.getFullYear();
        this.month = (keyDate.getMonth() + 1);
        if (keyDate.getMonth() < 9)
            this.month = "0" + this.month;
        this.tdate = keyDate.getDate();
        if (keyDate.getDate() < 10)
            this.tdate = "0" + this.tdate;
        var key = year + "-" + this.month + "-" + this.tdate;
        return key;
    }




}

