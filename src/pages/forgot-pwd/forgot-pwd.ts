import {errorhandler} from '../../services/error';
import {NavController} from 'ionic-angular';
import {Component,forwardRef} from '@angular/core';
import {Login} from '../login/login';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FacebookComponent} from '../../facebookLogin/FacebookLogin';
import {config} from '../../config'
import {Rxjs} from '../../services/Rxjs'
@Component({
    templateUrl: 'forgot-pwd.html',
//    directives: [ZarpoNavComponent, FacebookComponent]
})

export class ForgotPwd {
    pageTitle: string = "Reenvio de senha";
    path: string = "/login";
    username: string = "";
    errorMsg: boolean = false;
    buttonText: string = "Enviar nova senha";
    successMsg: boolean = false;
    nav: NavController;
    public wrongCredit: Boolean = false;
    load: Boolean;
    constructor(private _nav: NavController, private _ajaxRxjs: Rxjs, private _errorhandler: errorhandler) {
        this.nav = this._nav;
    }
    modelChange() {
        this.successMsg = false;
        this.errorMsg = false;
        this.wrongCredit = false;
    };
    closeForgotPwd() {
        this.nav.push(Login);
    };
    sendpwd(error) {
      
        if (!this.username || error) {
            this.errorMsg = true;
        } else {
            this.buttonText = "Aguarde";
            let api = "forgotpass"
            let data = {
                email: this.username,
                website_id: config.websiteId
            }
            this.load = true;
            this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
                if (response.forgot_status == "Y") {
                    this.load = false;
                    this.successMsg = true;
                    this.buttonText = "Enviar nova senha";
                } else {
                    this.load = false;
                    this.wrongCredit = true;
                    this.buttonText = "Enviar nova senha";
                }
            }, (error) => {
                this._errorhandler.err(error);
            });
        }
    }

}

