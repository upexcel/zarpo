import {NavController} from 'ionic-angular'
import {Component} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {HotelFlash} from '../hotel-flash/hotel-flash';
@Component({
    templateUrl: 'feedbackLandings.html',
//    directives: [FooterComponent, ZarpoNavComponent]
})

export class feedbackLanding {
    public pageTitle = 'Obrigado!';
    public zarpoIcon = true;
    public apiLoader = false;
    constructor(private _nav: NavController) {
        this._nav = _nav;
    }
    goState(view) {
        if (view == 'flash') {
            this._nav.push(HotelFlash, { hotelType: 'Hotel' });
        } else if (view == 'pacote') {
            this._nav.push(HotelFlash, { hotelType: 'Pacote' });;
        } else if (view == 'zarpoja') {
            this._nav.push(HotelFlash, { hotelType: 'Ja' });;
        }
    }
}
