import { NavController, Platform} from 'ionic-angular'
import {Component,Input} from '@angular/core';
import {config} from '../config'
import {Rxjs} from '../services/Rxjs'
import {menu} from '../pages/menu/menu.component'
import {facebookLogin} from '../services/fbLogin';
import {errorhandler} from '../services/error';
import {HotelFlash} from '../pages/hotel-flash/hotel-flash';
import {LocalStorageService} from '../services/local-storage.service';
@Component({
    selector: "fb-login",
    templateUrl: 'facebook.html',
 
})

export class FacebookComponent {

    public fb_button: string = 'Ou entrar pelo Facebook';
   
   public wrongCredit: Boolean = false;
    constructor(private _ajaxRxjs: Rxjs,
        private _platform: Platform,
        private _nav: NavController,
        private _facebookLogin: facebookLogin,
        private _errorhandler: errorhandler,
         private _localStorage: LocalStorageService) {
        this._nav = _nav;
        this._platform = _platform;
    }

    fbLogin() {
        this.fb_button = "Aguarde";
        if (this._platform.is('core')) {
            //           Facebook.browserInit(config.faceBook_AppId);
        } else {
      this._facebookLogin.fbLogin()
                .then(response => {
                    if (response.errorMessage || response == "cordova_not_available") {
                        this.fb_button = 'Ou entrar pelo Facebook';
                    } else {
                        let api = "facebook"
                        let data = {
                            id: response.id,
                            email: response.email,
                            fname: response.first_name,
                            lname: response.last_name,
                            website_id: config.websiteId
                        }
                        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
                            if (response.data.login_status === "Yes") {
                                this._localStorage.setValue('user_data',response);
                                this._nav.setRoot(menu);
                            } else {
                                this.fb_button = 'Ou entrar pelo Facebook';
                                this.wrongCredit = true;
                            }
                        }, (error) => {
                            this._errorhandler.err(error);
                        })
                    }
                },
                (error) => {
                    this._errorhandler.err(error);
                });
        }
    }
    
}
