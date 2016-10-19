import {NavController, Platform} from 'ionic-angular'
import {Component} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {config} from '../../config';
import {terms} from '../terms_condition/termsCondition';
import {myAccount} from '../myAccount/myAccount';
import {menu} from '../menu/menu.component'

@Component({
    templateUrl: 'privacy.html',
//    directives: [FooterComponent,ZarpoNavComponent]
})

export class privacy {
    public pageTitle = 'Política de privacidade';
    public showBack = false;
    public apiLoader=false;
    zarpoIcon:boolean;
    constructor(
        private _nav: NavController) {
        this._nav = _nav;
    }
    redirect(page){
        if(page=='termsofuse'){
            this._nav.push(terms)
        }else if(page=='myaccount'){
            this._nav.push(myAccount)
        }
    }




}
