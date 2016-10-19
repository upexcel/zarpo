import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular'
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {ProductPayment} from '../product-payment/product-payment';


@Component({
    templateUrl: 'timeout.html',
//    directives: [ZarpoNavComponent],
})

export class Timeout {
    public zarpoIcon: boolean = false;
    pageTitle: string = 'Opa!';
    giftName: string;
    giftLocation: string;
    apiLoader:boolean;
    constructor(
        private _navParams: NavParams,
        private _nav: NavController
    ) {

    }

}
