import {NavController, Platform} from 'ionic-angular'
import {Component} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {Rxjs} from '../../services/Rxjs'
import {LocalStorageService} from '../../services/local-storage.service';
import {HotelFlash} from '../hotel-flash/hotel-flash';

@Component({
    templateUrl: 'reservation.html',
//    directives: [FooterComponent, ZarpoNavComponent]
})

export class myReservation {
    public pageTitle = 'Minhas Reservas';
    public showBack = false;
    public apiLoader = false;
    showData: boolean = false;
    list:any;
    constructor(
        private _nav: NavController, private _ajaxRxjs: Rxjs, private _user: LocalStorageService) {
        this._nav = _nav;
    }
    ionViewWillEnter() {
        let api = 'orders'

        this._user.getValue('user_data').then((response) => {
            if (response) {
                let data = {
                    user_token: response.data.user_token
                }
                this.ajaxCall(api, data)
            }

        })

    }

    ajaxCall(api, data) {
        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
            if (response.data.reservationExist === true) {
                this.showData = true;
                this.list=response.data;
            } else {
                this.showData = false;
            }
        }, (error) => {

        });
    }

    redirect() {
        this._nav.push(HotelFlash);
    }
}

