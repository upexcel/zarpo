import { Injectable, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

declare var Promise: any;
@Injectable()
export class LocalStorageService {

    constructor(public local: Storage) {
        //        this.local = new Storage(LocalStorage);
        this.cleanUpTimerStorage();
    }
    cleanUpTimerStorage() {
        var cur_time = new Date().getTime();
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf('_expire') === -1) {
                var new_key = key + "_expire";
                var value = localStorage.getItem(new_key);
                //                if (value && cur_time > value) {
                //                    localStorage.removeItem(key);
                //                    localStorage.removeItem(new_key);
                //                }
            }
        }
    }
    setTimerStorage(key: string, data: any, hours: number) {
        this.cleanUpTimerStorage();
        this.setValue(key, data);
        var time_key = key + '_expire';
        var time = new Date().getTime();
        time = time + (hours * 1 * 60 * 60 * 1000);
        this.setValue(time_key, time);
    }
    getTimerStorage(key: string) {
        this.cleanUpTimerStorage();
        var time_key = key;
        //check if stored value is expired or not
        return this.getValue(time_key).then((value) => {

            var expire;
            //if value returned
            if (value) {
                //                expire = value * 1;
                //                if (new Date().getTime() > expire) {
                //                    this.setValue(key, null);
                //                    this.setValue(time_key, null);
                //                    return false;
                //                }
                //                else {
                //                    return value;
                //                }
            }
            else {
                return false;
            }
        });
    }
    removeTimerStorage(key: string) {
        this.cleanUpTimerStorage();
        var time_key = key + '_expire';
        this.setValue(key, false);
        this.setValue(time_key, false);
    }
    getValue(key: string) {
        //        this.local = new Storage(LocalStorage);
        return this.local.get(key).then((data) => {
            if (data) {

                let responseData = JSON.parse(data);
                return new Promise((resolve: any, reject: any) => resolve(responseData));
                //                return Promise.resolve(responseData);
            }
            //if key is not set yet
            else {
                return Promise.resolve(null);
            }

        });
    }
    setValue(key: string, value: any) {
        //        this.local = new Storage(LocalStorage);
        console.log('as', this.local);
        this.local.set(key, JSON.stringify(value));


    }
    remove(key: string) {
        this.local.remove(key);
    }

}
