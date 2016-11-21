import { Injectable, OnInit} from '@angular/core';
//import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import {config} from '../config'
import {Md5} from 'ts-md5/dist/md5';
import {LocalStorageService} from './local-storage.service';

@Injectable()
export class Rxjs implements OnInit {
    local: Storage;
    userToken: any = '';
    groupId: string;
    isJa: boolean = false;
    ngOnInit() {
        this.populateItems();
    }
    constructor(private http: Http, private _localStorageService: LocalStorageService) {
        this.populateItems();
    }
    populateItems() {
        this._localStorageService.getValue('user_data').then((response) => {
            if (response) {
                this.userToken = response.data.user_token;
                this.groupId = response.data.group_id;
            }
            else {
                this.userToken = "";
            }

        });
    }
    ajaxRequest(path: string, data: any): Observable<{}> {
        let dataPacket;
        dataPacket = Md5.hashStr(JSON.stringify(data));

        if (data.user_token) {
            this.userToken = data.user_token;
        }
        let newdata = {
            digest: dataPacket,
            data: data,
            user_token: this.userToken
        };

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        let url = config.api_url + path;
        return this.http.post(url, JSON.stringify(newdata), options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status + res.url);
        }
        return body || {};
    }
    private handleError(error: any) {
        let errMsg = error.message || 'Server error';
        return Observable.throw(errMsg);

    }

   
}
