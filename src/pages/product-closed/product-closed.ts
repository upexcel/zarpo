import {NavParams, NavController} from 'ionic-angular';
import {Component, forwardRef} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {HotelFlash} from '../hotel-flash/hotel-flash';

@Component({
    templateUrl: 'product-closed.html',
//    directives: [forwardRef(() => ZarpoNavComponent)],
})

export class ProductClosed {
    public zarpoIcon: boolean = false;
    flashType: string;
    pageTitle: string = 'Opa!';
    constructor(private _nav: NavController, private _navParams: NavParams) {
        this.flashType = this._navParams.get('flashType');
        console.log(this.flashType);
    }
    backToFlash() {
        //send to respective flash page
        this._nav.push(HotelFlash, { hotelType: this.flashType });

    }
}
