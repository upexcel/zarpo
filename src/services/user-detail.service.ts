import { Injectable, OnInit} from '@angular/core';
import {Rxjs} from './Rxjs';
import {errorhandler} from './error';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import {LocalStorageService} from './local-storage.service';

@Injectable()
export class UserDetailService implements OnInit {
    path = "customer_details";
    data = {
        user_token: "",
        is_ja: false
    };
    userToken: string;
    private userData: any;
    ngOnInit() {
    }
    constructor(
        private _api: Rxjs,
        private _local: LocalStorageService,
        private _errorhandler: errorhandler
    ) {
    }
    fetchUserData() {
        return this._local.getValue('user_data').then((response) => {
            if (response) {
                this.data.user_token = response.data.user_token;
                return this._api.ajaxRequest(this.path, this.data).map((response: any) => {
                    if (response.data) {
                        this.userData = response.data;
                        
                        return this.userData;
                    }
                    else {
                        return {};
                    }
                }, (error: any) => {
                    this._errorhandler.err(error);
                    return {};
                });
            }
            else {
                return {};
            }
        });
    }

}