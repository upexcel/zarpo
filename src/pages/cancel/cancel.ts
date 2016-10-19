import {NavController, Platform} from 'ionic-angular'
import {config} from '../../config'
import {Rxjs} from '../../services/Rxjs'
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FlashCardComponent} from '../../flash-card/flash-card.component';
import {errorhandler} from '../../services/error';
import {Component,forwardRef} from '@angular/core';
@Component({
    templateUrl: 'cancelNewsLetter.html',
//    directives: [ZarpoNavComponent, FlashCardComponent],
})

export class cancel {
    public zarpoIcon: boolean = true;
    pageTitle: string = 'Cancelar a newsletter';
    button_value: string = 'Cancelar Newsletter'
    public user_email: string = '';
    public Uemail: boolean;
    resMsg: any; errorShow: boolean = false;
    apiLoader:any;
    constructor(private _ajaxRxjs: Rxjs, private _errorhandler: errorhandler) { }

    submitCancel(user: any) {
        this.errorShow = true;
        if (!user) {
            this.Uemail = true;
        }
        else {
            this.button_value = 'Aguarde';
            let api = "newsletter"
            let data = {
                email: this.user_email,
                is_subscribed: config.is_subscribed,
                is_ja: false
            }
            this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
                this.button_value = 'Cancelar Newsletter';
                this.resMsg = response.data.status_message;
            }, (error) => {
                this._errorhandler.err(error);
            });
        }

    }
    onKey(event) {
        this.errorShow = false;
    }
}
