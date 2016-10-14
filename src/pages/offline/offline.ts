import { NavController, Platform} from 'ionic-angular'
import {Component} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {config} from '../../config';
import {terms} from '../terms_condition/termsCondition';
import {myAccount} from '../myAccount/myAccount';
import {menu} from '../menu/menu.component';
import {Login} from '../login/login'
import {Network} from 'ionic-native';
import {LocalStorageService} from '../../services/local-storage.service';
@Component({
    templateUrl: 'offline.html',
//    directives: [FooterComponent, ZarpoNavComponent]
})

export class offline {
    public pageTitle = 'Opa!';
    public zarpoIcon = true;
    public apiLoader = false;
    public user_login: boolean = false;
    constructor(
        private _nav: NavController, private _localStorage: LocalStorageService) {
        this._nav = _nav;
        this._localStorage.getValue('user_data').then((response) => {
            if (response) {
                this.user_login = true;
            }
            else {
                this.user_login = false;
            }
        })
    }
    backFlash() {
        if (Network.connection ==='none') {
            console.log('connect to network')
        } else {
            if (this.user_login) {
                this._nav.setRoot(menu);
            } else {
                console.log('login user no');
                this._nav.setRoot(Login);
            }
        }
    }




}
