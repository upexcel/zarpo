import {Events, NavParams, Content} from 'ionic-angular';
import {Component, AfterViewChecked, forwardRef, ViewChild} from '@angular/core';
import {errorhandler} from '../../services/error';
import {NavController} from 'ionic-angular';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {ProductPayment} from '../product-payment/product-payment';
import {FooterComponent} from '../../footer/footer.component';
import {Rxjs} from '../../services/Rxjs';
import {LocalStorageService} from '../../services/local-storage.service';
import {CalenderService} from '../../services/calender.service';
import {KeysPipe} from '../../filters/keys/keys.pipe';
import {AdultChildPipe} from '../../filters/keys/adult-child.pipe';
import {GuestDetailService} from '../../services/guest-detail.service';
import {CheckSelectedService} from '../../services/check-selected.service';
import {NoSpaceDirective} from '../../directives/no-space.directive';
import {OnReturnDirective} from '../../directives/on-return.directive';



@Component({
//    templateUrl: 'guest-detail.html',
//    directives: [forwardRef(() => ZarpoNavComponent), FooterComponent],
//    providers: [],
//    pipes: [KeysPipe, AdultChildPipe]
})
export class GuestDetail{
//export class GuestDetail implements AfterViewChecked {
//    @ViewChild(Content) content: Content;
//    ngAfterViewChecked() {
//
//    }
//    pageTitle: string = "Informe quem vai viajar";
//    zarpoIcon: boolean = false;
//    path: string = "product";
//    locationPoints: {};
//    bookingRooms: any;
//    data: any = {
//        product_id: "",
//        user_token: "",
//        group_id: "",
//        is_ja: false
//    };
//    comment: string;
//    nav: NavController;
//    navParams: NavParams;
//    api: Rxjs;
//    ifPaymentConfirmed: boolean;
//    creditCard: {};
//    ifSubmitted: boolean;;
//    disableMyForm: boolean
//    constructor(
//        private _nav: NavController,
//        private _navParams: NavParams,
//        public _events: Events,
//        private _localStorageService: LocalStorageService,
//        private _ajaxRxjs: Rxjs,
//        private _errorhandler: errorhandler,
//        private _calenderService: CalenderService,
//        private _guestDetailService: GuestDetailService,
//        private _checkSelected: CheckSelectedService
//
//    ) {
//
//    }
//    ionViewWillEnter() {
//        this.ifSubmitted = false;
//        this._guestDetailService.getData().then((response: any) => {
//            this.bookingRooms = this.reConstructObject(response.selectedRoom);
//            console.log(this.bookingRooms);
//            //fetch login user and set as 1 guest
//            this._localStorageService.getValue('user_data').then((response) => {
//                this.bookingRooms[0].selected[0].username = response.data.customer_firstname + " " + response.data.customer_lastname;
//            });
//
//        });
//
//    }
//    reConstructObject(data: any) {
//        for (var i = 0; i < data.length; i++) {
//            data[i].selected = {};
//            for (var j = 0; j < parseInt(data[i].rooms); j++) {
//                data[i].selected[j] = {};
//                data[i].selected[j].adult = "0";
//                data[i].selected[j].child = "0";
//                data[i].selected[j].username = "";
//                data[i].selected[j].childAge = "";
//            }
//
//        }
//        console.log(data);
//        return data;
//    }
//    scrollToBottom(): void {
//    }
//    recordOrder() {
//        //        var res = this.ifEmpty();
//        this.ifSubmitted = true;
//        //        $localStorage["registerRoom"] = this.bookingRooms;
//        //        console.log($localStorage["registerRoom"]);
//
//        var CheckSelectedData = {
//            selectedRoom: this.bookingRooms,
//            specialMsg: this.comment
//        };
//
//        this._checkSelected.setData(CheckSelectedData);
//        //        console.log(CheckSelected.get());
//        for (var i = 0; i < Object.keys(this.bookingRooms).length; i++) {
//            console.log(this.bookingRooms[0]);
//            console.log(this.bookingRooms[i].selected);
//            for (var j = 0; j < Object.keys(this.bookingRooms[i].selected).length; j++) {
//                console.log("innerloop");
//                //if username for selected rooms are not mentioned
//                if (!this.bookingRooms[i].selected[j].username || this.bookingRooms[i].selected[j].username == "") {
//                    console.log("username not avl");
//                    return false;
//                }
//                //no. of adult must be selcted i.e should > 0
//                if (!this.bookingRooms[i].selected[j].adult || parseInt(this.bookingRooms[i].selected[j].adult) < 1) {
//                    console.log("no of adult not avl");
//                    return false;
//                }
//                //no. of kid is allowed and user selected kids arrival
//                // kids age must be there
//                if (this.bookingRooms[i].kid && parseInt(this.bookingRooms[i].selected[j].child) > 0) {
//                    if (!this.bookingRooms[i].selected[j].childAge) {
//                        console.log("child without childage");
//                        return false;
//                    }
//                }
//
//
//            }
//        }
//        var PaymentData = {
//            //            productType: "VALE",
//            //            productId: this._navParams.get('id'),
//            //            name: this.name,
//            //            location: this.location,
//            //            giftPrice: this._navParams.get('giftPrice') - this.reward,
//            //            totalPrice: this._navParams.get('giftPrice'),
//            //            presentear_Firstname: this.firstname,
//            //            presentear_Surname: this.surname,
//            //            presentear_Email: this._navParams.get('email'),
//            //            presentear_GiftDate: this._navParams.get('giftDate'),
//            //            presentear_Comment: this.comment,
//            //            super_attribute: this._navParams.get('super_attribute')
//        };
//        //send to payment
//        this._nav.push(ProductPayment, PaymentData);
//    };
//    ifEmpty() {
//        var empty = false;
//        for (var i = 0; i < Object.keys(this.bookingRooms).length; i++) {
//            if (this.bookingRooms[i]) {
//                //if user submit blank form / not fille any data for rooms
//                if (!this.bookingRooms[i].selected) {
//                    empty = true;
//                } else {
//                    for (var j = 0; j < Object.keys(this.bookingRooms[i].selected).length; j++) {
//                        //if form's username is undefined or blank
//                        if (!this.bookingRooms[i].selected[j].username || this.bookingRooms[i].selected[j].username == "") {
//                            empty = true;
//                        }
//                        //if form's adult is undefined or 0
//                        // mysql6.000webhost.com a2864463_wp 26Dec1987@
//                        if (!this.bookingRooms[i].selected[j].adult || this.bookingRooms[i].selected[j].adult == "0") {
//                            this.bookingRooms[i].selected[j].adult = "0";
//                            empty = true;
//                        }
//                        //if form's adult is undefined or 0
//                        if (this.bookingRooms[i].selected[j].child > 0 && !this.bookingRooms[i].selected[j].childAge) {
//                            empty = true;
//                        }
//                    }
//                }
//            }
//        }
//
//        return empty;
//    };
//    convertArray(data: any) {
//        console.log(new Array(parseInt(data)));
//        return new Array(parseInt(data));
//    };
//    modelChange() {
//        this.ifSubmitted = false;
//        this.creditCard = {};
//        this.creditCard['hasError'] = false;
//        if (this.ifSubmitted) {
//            this.ifSubmitted = false;
//        }
//
//        this.ifPaymentConfirmed = false;
//    };

}

