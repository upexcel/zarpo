import { Injectable, OnInit} from '@angular/core';
import {Rxjs} from './Rxjs';
import {errorhandler} from './error';
import _ from 'lodash'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import {Observable}     from 'rxjs/Observable';
@Injectable()
export class CalenderService implements OnInit {
    path = "booking";
    data = {
        website_code: "",
        product_id: 0,
        is_ja: false
    };
    public calenderData: {};
    public id: number;
    ngOnInit() {
    }
    constructor(private api: Rxjs,
        private _errorhandler: errorhandler) {
    }

    fetchCalenderData(id: number, is_ja) {
        this.data.website_code = 'zarpo';
        this.data.product_id = id;
        this.data.is_ja = is_ja;
      return  this.api.ajaxRequest(this.path, this.data).map((response: any) => {
            if (response.data) {
                this.calenderData = response.data;
                this.id = id;
                return this.calenderData;
            }
            else {
                return {};
            }
        }, (error) => {
            this._errorhandler.err(error);
            return {};
        });
    }
    getCalenderData(id: number) {
        //if data is already is fetched for same product return it
        if (this.calenderData && this.id === id) {
            return Promise.resolve(this.calenderData);
        }
        else {
            return Promise.resolve({});
        }

    }
    getStockData(dateStock: any) {
        var oneMore = [];
        var newStock = {};
        _.each(dateStock, function(value, key) {
            var stock_key = key.split("_");
            //stock_key[1] i.e the date part of the key
            newStock[stock_key[1]] = value;
            oneMore.push(stock_key[1]);
        });
        return Promise.resolve({
            newStock: newStock,
            oneMore: oneMore
        });
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
    nextDate(startDate: string) {
        var nextDate = "";

        var dateObj = this.changePerTimeZone(startDate);
        dateObj.setDate(dateObj.getDate() + 1);

        var d: any = dateObj.getDate();
        if (d < 10)
            d = "0" + d;
        var m: any = dateObj.getMonth() + 1;
        if (m < 10)
            m = "0" + m;
        var y = dateObj.getFullYear();
        nextDate = y + "-" + m + "-" + d;
        return nextDate;
    }
    getAvailableStock(dateStock: any, newcheckinTimestamp: any, flashType: any) {
        var newDayStock = [];
        for (let key in dateStock) {
            newDayStock.push(key);
        }
        var dayStock;
        dayStock = this.createRegularStock(newDayStock, newcheckinTimestamp, flashType);
        return Promise.resolve(dayStock);

    }
    createRegularStock(dateStock: any, newcheckinTimestamp, flashType) {
        var start = newcheckinTimestamp;
        var newDayStock: any = [];
        for (var i = 0; i < dateStock.length; i++) {
            var key = this.nextDate(newcheckinTimestamp);
            if (dateStock.indexOf(key) !== -1) {
                newDayStock.push(key);
                newcheckinTimestamp = key;
            } else {
                // checout is possible to on day next to stock available
                // so include one extra date
                if (flashType == 'Pacote') {
                    break;
                }
                else {
                    newDayStock.push(key);
                    break;
                }
            }

        }
        return newDayStock;
    }

}