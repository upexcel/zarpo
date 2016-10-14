import {NavParams, NavController, Platform} from 'ionic-angular';
import {InAppBrowser} from 'ionic-native';

import {Component, forwardRef} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {HotelFlash} from '../hotel-flash/hotel-flash';

@Component({
    templateUrl: 'order-success.html',
//    directives: [forwardRef(() => ZarpoNavComponent)],
})

export class OrderSuccess {
    public zarpoIcon: boolean = true;
    pageTitle: string = 'Sucesso!';
    platform: Platform;
    constructor(private _nav: NavController,
        private _navParams: NavParams,
        private _platform: Platform) {
        this.platform = this._platform;
    }
    backToFlash() {
        var url = "http://m.zarpo.com.br/dados-passageiros/?reserva=100064836";
        this.platform.ready().then(() => {
            InAppBrowser.open(url, "_blank", "location=true");
        });
    }
}
