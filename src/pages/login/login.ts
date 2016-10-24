import {NavController, Platform} from 'ionic-angular'
import {Component} from '@angular/core';
import {ForgotPwd} from '../forgot-pwd/forgot-pwd';
import {FooterComponent} from '../../footer/footer.component';
import {config} from '../../config'
import {Rxjs} from '../../services/Rxjs'
import {menu} from '../menu/menu.component'
import {HotelFlash} from '../hotel-flash/hotel-flash';
import {STATE, State, User} from './state.data'
import {errorhandler} from '../../services/error';
import {FacebookComponent} from '../../facebookLogin/FacebookLogin';
import {LocalStorageService} from '../../services/local-storage.service';
import {UserDetailService} from '../../services/user-detail.service';
import {NoSpaceDirective} from '../../directives/no-space.directive';
import {OnReturnDirective} from '../../directives/on-return.directive';

@Component({
    templateUrl: 'login.html',
    //    directives: [FooterComponent, FacebookComponent, NoSpaceDirective, OnReturnDirective],
})

export class Login {
    public ifUserRegistered: boolean = false;
    public signup_button: string = "Entrar no Zarpo";
    public regbt: string = 'Finalizar'
    public fb_button: string = 'Ou entrar pelo Facebook';
    public placeholder: string = "Sua senha";
    public signupForm: boolean = false;
    public user: {} = {};
    state: State[] = STATE;
    public userEmail: string;
    public ragerror: boolean = false;
    public registerSubmit: boolean = false;
    public Uemail: Boolean; public Upassword: Boolean; public wrongCredit: Boolean = false;

    constructor(private _ajaxRxjs: Rxjs,
        private _platform: Platform,
        private _nav: NavController, private _userData: UserDetailService,
        private _errorhandler: errorhandler,
        private _localStorage: LocalStorageService
    ) {
        this._nav = _nav;
        this._platform = _platform;
        this.user['state'] = 'Escolha seu estado';
        
    }

    signUp() {
        this.placeholder = "Criar uma senha"
        this.ifUserRegistered = false;
        this.signup_button = "Cadastrar-se";
        this.Uemail = false;
        this.wrongCredit = false;
        this.Upassword = false;

    }
    signIn() {
        this.placeholder = "Sua senha"
        this.signup_button = "Entrar no Zarpo";
        this.ifUserRegistered = true;
        this.signupForm = false;
        this.Uemail = false;
        this.wrongCredit = false;
        this.Upassword = false;

    }
    ionViewWillEnter() {
        this._localStorage.getValue('last_login').then((response: any) => {
            if (response) {
                this.user['email'] = response.email;
                this.user['password'] = response.pass;
                this.user['state'] = "Escolha seu estado";
            }
            else {

            }
        });

    }
    onchange(event) {
        console.log(event);
        this.user['state'] = event;
    }

    login(user: User, btn, error) {

        if (!user.email || error) {
            this.Uemail = true;
            if (!user.password) {
                this.Upassword = true;
            }
        } else if (!user.password || user.password.length <= config.user_password) {
            this.Upassword = true;

        }
        else if (user.email && user.password && user.password.length > config.user_password && !error) {
            this.signup_button = "Aguarde";
            let api = "login"
            let data = {
                username: user.email,
                password: user.password,
                website_id: config.websiteId
            }
            this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
                console.log('login data', response);
                if (response.data.registration_status == 'Y' || response.data.login_status == "INCOMPLETE") {
                    this._localStorage.setValue('last_login', { email: user.email, pass: user.password });
                    this.ifUserRegistered = false;
                    this.userEmail = response.data.customer_email;
                    this.signupForm = true;
                    this.signup_button = 'Finalizar';
                } else if (response.data.login_status == "Yes") {
                    this._localStorage.setValue('last_login', { email: user.email, pass: user.password });
                    this._localStorage.setValue('user_data', response);
                    this._localStorage.setValue('user_token', response.user_token);
                    console.log('move to menu');
                    this._nav.push(menu);
                    //                    this._nav.push(HotelFlash);
                } else {
                    this.wrongCredit = true;
                    this.signup_button = btn;
                }
            }, (error) => {
                this._errorhandler.err(error);
            });
        }
    }
    register(user: User, btn) {
        this.registerSubmit = true;
        let api = "register"
        let data = {
            email: this.userEmail,
            name: user.name,
            surname: user.surname,
            state: user.state
        }
        console.log(data);
        if (user.name && user.surname && user.state && user.state != 'Escolha seu estado') {
            this.signup_button = "Aguarde";
            this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
                if (response.data.login_status === "Yes") {
                    this._localStorage.setValue('user_data', response);
                    this._nav.setRoot(menu);
                } else {
                    this.regbt = btn;
                    this.wrongCredit = true;
                }
            }, (error) => {
                this._errorhandler.err(error);
            });
        } else {
            this.signup_button = btn;
            this.ragerror = true;

        }
    }


    goForgotPwd() {
        this._nav.setRoot(ForgotPwd);

    }
    modelChange() {
        this.registerSubmit = false;
        console.log('login input');
        this.Uemail = false;
        this.wrongCredit = false;
        this.Upassword = false;
        this.ragerror = false;
    }

}

