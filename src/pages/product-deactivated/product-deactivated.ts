import {NavController} from 'ionic-angular';
import {Component,forwardRef} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {HotelFlash} from '../hotel-flash/hotel-flash';

@Component({
    templateUrl: 'product-deactivated.html',
//    directives: [forwardRef(() => ZarpoNavComponent)],
})

export class ProductDeactivated {
    public zarpoIcon: boolean = true;
    pageTitle: string = 'Opa!';
    constructor(private _nav: NavController) {
    }
    backToJaFlash() {
        this._nav.push(HotelFlash,{ hotelType: 'Ja'});
    }
}
