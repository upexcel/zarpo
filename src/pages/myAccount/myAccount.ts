import {Component} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {terms} from '../terms_condition/termsCondition'
import {ViewChild} from '@angular/core';
import {Nav, NavController} from 'ionic-angular';
import {privacy} from '../privacy/privacy'
import {invite} from '../inviteFriends/invite'
import {mordomo} from '../mordomo_zarpo/mordomo'
import {nLetter} from '../newsLetter/newsletter'
import {myReservation} from '../myreservation/reservation'
@Component({
    templateUrl: 'myAccount.html'
//    directives: [ZarpoNavComponent]
})

export class myAccount {
    @ViewChild(Nav) nav: Nav;
    public zarpoIcon = true;
    public pageTitle = "Minha Conta";
    public user_email: string = '';
    public user_name: string = ''
    public user_Lname:string='';
    apiLoader:boolean;
    showme:any;
    constructor(private _local: LocalStorageService, private _nav: NavController) {
        this._local.getValue('user_data').then((response: any) => {
            this.user_email = response.data.customer_email;
            this.user_name = response.data.customer_firstname;
            this .user_Lname=response.data.customer_lastname;
        });
    }
    redirect(subPage) {

        if (subPage == 'termsofuse') {
            this._nav.push(terms);
        } else if (subPage == 'privacy') {
            this._nav.push(privacy);
        } else if (subPage == 'contact') {
            this._nav.push(mordomo, { name: 'myAccount' })
        } else if (subPage == 'invitefriends') {
            this._nav.push(invite, { name: 'myAccount' });
        } else if (subPage == 'newsletters') {
            this._nav.push(nLetter);
        } else if (subPage == 'myreservation') {
            this._nav.push(myReservation);
        }
    }

}
