import {NavController, Platform} from 'ionic-angular'
import {Component} from '@angular/core';
import {ForgotPwd} from '../forgot-pwd/forgot-pwd';
import {FooterComponent} from '../../footer/footer.component';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {privacy} from '../privacy/privacy'
import {menu} from '../menu/menu.component'

@Component({
    templateUrl: 'termsCondition.html',
//    directives: [FooterComponent,ZarpoNavComponent],
})

export class terms {
    public pageTitle = 'Termos de Uso';
    public showBack = false;
    public apiLoader=false;
    zarpoIcon:boolean;
    constructor(
        private _nav: NavController) {
        this._nav = _nav;
    }
redirect(page){
    this._nav.push(privacy)
}




}
