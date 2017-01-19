import { Content, NavController, NavParams, Platform } from 'ionic-angular'
import { Component } from '@angular/core';
import { ForgotPwd } from '../forgot-pwd/forgot-pwd';
import { FooterComponent } from '../../footer/footer.component';
import { ZarpoNavComponent } from '../../zarpo-nav/zarpo-nav.component';
import { privacy } from '../privacy/privacy'
import { menu } from '../menu/menu.component'
import { errorhandler } from '../../services/error';
import { config } from '../../config'
import { Rxjs } from '../../services/Rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { SocialSharing } from 'ionic-native';
import { AppAvailability } from 'ionic-native';
import { Clipboard } from 'ionic-native';
declare var $: any;

@Component({
    templateUrl: 'invite.html'
})

export class invite {
    public pageTitle = 'Convidar Amigos';
    public zarpoIcon = true;
    apiLoader = false;
    public button_name: string = 'Enviar Convites'
    public userToken: any;
    public user_reward: {} = {};
    public invite_url: any;
    public dataShow: boolean = false;
    public copyUrl: boolean = false;
    public invitationSubmit: boolean = false;
    public error_msg: string;
    public frndemail: {} = {
        emailone: '',
        emailtwo: '',
        emailthree: ''
    }
    public success_msg: boolean = false;
    public invalidEmail: string = "";
    public bindData: any;
    itemObject: any;
    constructor(
        private _nav: NavController,
        private _navParams: NavParams,
        private _ajaxRxjs: Rxjs,
        private _errorhandler: errorhandler,
        private _user: LocalStorageService,
        private platform: Platform) {
        this.apiLoader = true;
        this._nav = _nav;
        this._user = _user;
        this._navParams = _navParams;
        this.platform = platform;
        if (this._navParams.get('name')) {
            this.zarpoIcon = false;
        }
        //        $(document).ready(function() {
        //            $('input').on('focus', function(e) {
        //                e.originalEvent.srcElement.autofocus = true;
        //                console.log("focus", e.originalEvent.srcElement.autofocus)
        //                console.log("focus", e)
        ////                e.preventDefault(); e.stopPropagation();
        ////                window.scrollTo(0, 0); //the second 0 marks the Y scroll pos. Setting this to i.e. 100 will push the screen up by 100px. 
        //                console.log("jquery working")
        //            });
        //        })
    }
    change(e) {
        console.log("change coll", e);
    }
    ionViewWillEnter() {
        this._user.getValue('user_data').then((response) => {
            if (response) {
                this.userToken = response.data.user_token;
                this.loadRewards(this.userToken);
            }
            else {
                this.userToken = "";
            }
        })

    }
    redirect(page) {
        this._nav.push(privacy)
    }
    inviteFrnd(email: any, email1, email2, email3) {
        this.invitationSubmit = true

        if (email1 && email.emailone) {
            this.invalidEmail = "email1";

        } else if (email2 && email.emailtwo) {
            this.invalidEmail = "email2";
        } else if (email3 && email.emailthree) {
            this.invalidEmail = "email3";
        }
        else if (!email.emailone && !email.emailthree && !email.emailthree) {
            this.invalidEmail = "blank";
        } else {
            this.button_name = 'Aguarde';
            let api = 'invite'
            let data = {
                inviter_customer_id: this.userToken,
                email: [email.emailone, email.emailtwo, email.emailthree],
                website_id: config.websiteId,
                is_ja: false
            }
            this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
                console.log(response);
                this.button_name = 'Enviar Convites';
                if (response.error == 1) {
                    this.error_msg = response.error_status_message;
                }
                else if (response.data.status && response.data.status == 'Y') {
                    this.success_msg = true;
                }
            }, (error) => {
                this._errorhandler.err(error);
            });
        }
    }
    modelChange() {
        this.invitationSubmit = false
        this.invalidEmail = '';
        this.error_msg = '';
    }
    loadRewards(token) {
        let api = "reward";
        let userReward = [];
        let myrewarddata = {
            user_token: token,
            customer_id: token,
            website_id: config.websiteId,
            is_ja: false
        };
        this._ajaxRxjs.ajaxRequest(api, myrewarddata).subscribe((response: any) => {
            console.log(response);
            this.user_reward = response.data;
            let str = response.data.Créditos_disponíveis;
            let res = str.replace(",00", "");
            this.bindData = res;
            //            this.apiLoader = false;
            this.invitation_url(this.userToken);
        }, (error) => {
            this.apiLoader = false;
            this._errorhandler.err(error);
        });
    }
    invitation_url(token) {
        let api = "invitation_url";
        let userReward = [];
        let myrewarddata = {
            user_token: token,
            website_id: config.websiteId,
            is_ja: false
        };
        this._ajaxRxjs.ajaxRequest(api, myrewarddata).subscribe((response: any) => {
            this.invite_url = response.data;
            this.apiLoader = false;
            this.dataShow = true;
        }, (error) => {
            this.apiLoader = false;
            this._errorhandler.err(error);
        });
    }
    share(btn) {

        if (btn == 'fb') {
            var app;

            if (this.platform.is('ios')) {
                app = 'fb://'
            } else {
                app = 'com.facebook.katana'
            }
            AppAvailability.check(app)
                .then(yes => {
                    SocialSharing.shareViaFacebook(null, null, this.invite_url.invitation_url_fb)

                },
                no => {

                    open(this.invite_url.invitation_url_fb, '_system', 'location=yes')
                });

        }
        else if (btn == 'twitter') {
            var app;
            if (this.platform.is('ios')) {
                app = 'twitter://'
            } else {
                app = 'com.twitter.android'
            }
            AppAvailability.check(app)
                .then(yes => {
                    SocialSharing.shareViaFacebook(null, null, this.invite_url.invitation_url_twitter)

                },
                no => {
                    open(this.invite_url.invitation_url_twitter, '_system', 'location=yes')
                });

        }

    }
    zarpobT(copy, url) {
        if (copy == 'copy') {
            this.copyUrl = true
            Clipboard.copy(url).then((response) => { });

        } else {
            this.copyUrl = false
        }
    }
}
