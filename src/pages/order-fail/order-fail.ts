import {NavParams, NavController} from 'ionic-angular';
import {Component, forwardRef} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {HotelFlash} from '../hotel-flash/hotel-flash';

@Component({
    templateUrl: 'order-fail.html',
    //    directives: [forwardRef(() => ZarpoNavComponent)],
})

export class OrderFail {
    public zarpoIcon: boolean = true;
    pageTitle: string = 'Problema com o seu pagamento';
    apiLoader: boolean;
    constructor(private _nav: NavController, private _navParams: NavParams) {
    }
    backToFlash() {
        this._nav.push(HotelFlash);
    }
}
