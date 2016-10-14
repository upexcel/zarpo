import {NavController, Platform} from 'ionic-angular'
import {Component} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {config} from '../../config';
import {errorhandler} from '../../services/error';
import {feedbackLanding} from './feedbackLanding';
import {LocalStorageService} from '../../services/local-storage.service';
import {Rxjs} from '../../services/Rxjs';
@Component({
    templateUrl: 'feedback.html',
//    directives: [FooterComponent, ZarpoNavComponent]
})

export class feedBack {
    public pageTitle = 'Avalie sua viagem';
    public zarpoIcon = true;
    public apiLoader = false;
    public submit_button = 'Enviar a sua avaliação!!'
    public hotelName: string='';
    public textbox2: string;
    public textbox1: string;
    public user_token: any;
    public errorMsg: string = ''
    public dataerror: boolean = false;
    appStar: number;
    constructor(private _nav: NavController, private local: LocalStorageService, private _ajaxRxjs: Rxjs, private _errorhandler: errorhandler) {
        this._nav = _nav;

        this.local.getValue('user_data').then((response: any) => {
            if (response) {
                this.user_token = response.data.user_token;
            }
        });
    }
    submit(btn) {
        if (!this.hotelName || !this.appStar) {
            this.dataerror = true;
        } else {
            this.submit_button = 'Aguarde'
            this.apiLoader = true;
            let api = 'avaliar'
            let data = {
                user_token: this.user_token,
                pacote_name: this.hotelName,
                score: this.appStar,
                gostou: this.textbox1,
                melhorado: this.textbox2,
                is_ja: false
            }
            this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
                console.log(response);
                this.submit_button = btn;
                this.apiLoader = false;
                if (response.status == 'N') {
                    this.errorMsg = response.status_message;
                    //should not
                        setTimeout(()=> {
                            this._nav.push(feedbackLanding);
                        }, 200);
                } else {
                    this._nav.push(feedbackLanding);
                }
            }, (error) => {
                this._errorhandler.err(error);
            });

        }

    }
    fillStar(val) {
        this.appStar = val;
        this.dataerror = false;
        this.errorMsg = '';

    }
    modelChange() {
        this.dataerror = false;
        this.errorMsg = '';
    }


}
