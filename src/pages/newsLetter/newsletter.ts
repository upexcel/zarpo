import {NavController, Platform} from 'ionic-angular'
import {Component} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {config} from '../../config';
import {terms} from '../terms_condition/termsCondition';
import {myAccount} from '../myAccount/myAccount';
import {menu} from '../menu/menu.component'
import {Rxjs} from '../../services/Rxjs';
import {LocalStorageService} from '../../services/local-storage.service';
import {errorhandler} from '../../services/error';
@Component({
    templateUrl: 'newsletter.html',
//    directives: [FooterComponent, ZarpoNavComponent]
})

export class nLetter {
    public pageTitle = 'Newsletter';
    public showBack = false;
    public apiLoader = true;
    public toggleval: any;
    public bt_name: string = 'Salvar preferências'
    public userToken: any; public msg: string;
    public subscribe: any; public user_detail: any;
    zarpoIcon:boolean;
    constructor(
        private _nav: NavController, private _user: LocalStorageService, private _ajaxRxjs: Rxjs, private _errorhandler: errorhandler) {
        this._nav = _nav;

    }
    ionViewWillEnter() {
        this._user.getValue('user_data').then((response) => {
            if (response) {
                this.userToken = response.data.user_token;
                this.userdetail(this.userToken);
            }
            else {
                this.userToken = "";
            }
        })

    }
    userdetail(token:any) {
        let api = 'customer_details';
        let data = {
            user_token: token,
            is_ja: false
        }
        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
            this.user_detail = response.data;
            this.apiLoader = false;
            if (response.data.is_subscribed == 0) {
                this.subscribe = false;
            } else {
                this.subscribe = true;
            }
        }, (error) => {
            this._errorhandler.err(error);
        });
    }
    toggleChange(event:any) {
 
        if (event._checked == true) {
            this.toggleval = 1
        } else {
            this.toggleval = 0;
        }
    }
    newsletter(bt:any) {
        console.log('hey',this.toggleval);
        if (this.toggleval == 0 || this.toggleval==1){
        this.bt_name = 'Aguarde';
        this.apiLoader = true;
        let api = "newsletter"
        let data = {
            website_id: config.websiteId,
            is_subscribed: this.toggleval,
            is_ja: false,
            user_token: this.userToken
        }
       
        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
            console.log(response)
            this.msg = response.data.status_message;
            this.bt_name = bt;
            this.apiLoader = false;
        }, (error) => {
            this._errorhandler.err(error);
        });
    }
    }
}
