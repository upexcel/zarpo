import {Component, forwardRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular'
import {GuestDetail} from '../guest-detail/guest-detail';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {ProductPayment} from '../product-payment/product-payment';
import {UserDetailService} from '../../services/user-detail.service';
import {DateService} from '../../services/date.service';
import {CheckReceiptService} from '../../services/check-receipt.service';
import {DateDayPipe} from '../../filters/date/date.pipe';
import {FormatDatePipe} from '../../filters/date/format-date.pipe';
import {DayPipe} from '../../filters/date/day.pipe';

@Component({
    templateUrl: 'receipt.html',
//    directives: [forwardRef(() => ZarpoNavComponent)],
    providers: [UserDetailService, DateService],
//    pipes: [DateDayPipe, FormatDatePipe, DayPipe]
})

export class Receipt {
    public zarpoIcon: boolean = false;
    pageTitle: string = 'Verifique seu vale presente';
    giftName: string;
    name: string;
    giftLocation: string;
    location: string;
    firstname: string;
    surname: string;
    hotelType: string;
    giftDate: string;
    checkInDate: string;
    checkOutDate: string;
    noOfRooms: number;
    comment: string
    giftPrice: number;
    clientPrice: number;
    displayPrice: number;
    reward: number = 0;
    lastCheckOut: string;
    totalNights: number;
    apiLoader:boolean;
    constructor(
        private _navParams: NavParams,
        private _nav: NavController,
        private _userData: UserDetailService,
        private _receiptService: CheckReceiptService,
        private _date: DateService
    ) {
        this.hotelType = this._navParams.get('productType');
        console.log(this.hotelType);
        if (this.hotelType === 'Vale') {
            console.log('vale');
            this.giftName = this._navParams.get('giftName');
            this.giftLocation = this._navParams.get('giftLocation');
            this.firstname = this._navParams.get('firstname');
            this.surname = this._navParams.get('surname');
            this.giftDate = this._navParams.get('giftDate');
            this.comment = this._navParams.get('comment');
            this.giftPrice = parseInt(this._navParams.get('giftPrice'));

        }
        else {
            console.log('not vale');
            this.checkInDate = this._navParams.get('productId');
            this.name = this._navParams.get('name');
            this.location = this._navParams.get('location');
            this.checkInDate = this._navParams.get('checkInDate');
            this.checkOutDate = this._navParams.get('checkOutDate');
            this.noOfRooms = this._navParams.get('noOfRooms');
            this.giftPrice = parseInt(this._navParams.get('giftPrice'));
            this.displayPrice = this._navParams.get('displayPrice');
            this.lastCheckOut = this._navParams.get('lastCheckOut');
            this.getNights();
        }


    }
    ionViewWillEnter() {
        this._userData.fetchUserData().then((result: any) => {
            result.subscribe((response: any) => {
                if (response.point_balance) {
                    console.log(response.point_balance);
                    console.log(this._navParams.get('giftPrice'));
                    var pointdiff = parseInt(this._navParams.get('giftPrice')) - parseInt(response.point_balance);
                    if (pointdiff >= 15) {
                        this.reward = parseInt(response.point_balance);
                    } else {
                        this.reward = parseInt(this._navParams.get('giftPrice')) - 15;
                    }
                }
            });
        });
    }
    getNights() {
        this._date.getNights(this.checkInDate, this.checkOutDate).then((response) => {
            this.totalNights = response;
            console.log(this.totalNights);
        });
    }
    redirect() {

        if (this.hotelType === 'Vale') {
            var giftPaymentData = {
                productType: this.hotelType,
                productId: this._navParams.get('id'),
                name: this.giftName,
                location: this.giftLocation,
                giftPrice: this._navParams.get('giftPrice') - this.reward,
                totalPrice: this._navParams.get('giftPrice'),
                presentear_Firstname: this.firstname,
                presentear_Surname: this.surname,
                presentear_Email: this._navParams.get('email'),
                presentear_GiftDate: this._navParams.get('giftDate'),
                presentear_Comment: this.comment,
                super_attribute: this._navParams.get('super_attribute')
            };
            this._receiptService.setData(giftPaymentData);
            this._nav.push(ProductPayment, giftPaymentData);
        }
        else {
            var receiptData = {
                productType: this.hotelType,
                productId: this._navParams.get('id'),
                name: this.giftName,
                location: this.giftLocation,
                checkInDate: this._navParams.get('checkInDate'),
                checkOutDate: this._navParams.get('checkOutDate'),
                lastCheckOut: this._navParams.get('lastCheckOut'),
                noOfRooms: this._navParams.get('noOfRooms'),
                giftPrice: this._navParams.get('giftPrice') - this.reward,
                displayPrice: this._navParams.get('displayPrice'),
                totalPrice: this._navParams.get('giftPrice'),
                super_attribute: this._navParams.get('super_attribute')
            };
            this._receiptService.setData(receiptData);
            this._nav.push(GuestDetail);
        }

    }

}
