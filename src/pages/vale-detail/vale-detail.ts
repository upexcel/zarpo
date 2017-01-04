import {Events, NavParams} from 'ionic-angular';
import {Component, ViewChild, ElementRef, forwardRef, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl}  from '@angular/forms';
import {errorhandler} from '../../services/error';
import {Content, NavController} from 'ionic-angular';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {ZarpoSliderComponent} from '../../zarpo-slider/zarpo-slider.component';
import {ZarpoAccordianComponent} from '../../zarpo-accordian/zarpo-accordian.component';
import {NoSpaceDirective} from '../../directives/no-space.directive';
import {OnReturnDirective} from '../../directives/on-return.directive';

import {Receipt} from '../receipt/receipt';
import {Rxjs} from '../../services/Rxjs';
import {UserDetailService} from '../../services/user-detail.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {ValeKeysPipe} from '../../filters/keys/vale-keys.pipe';
import {MyDatePicker} from '../my-date-picker/my-date-picker.component';
import {CheckReceiptService} from '../../services/check-receipt.service';
import {DateService} from '../../services/date.service';
import {EmailValidator} from '../../validators/email.validator';
import {DateValidator} from '../../validators/date.validator';

@Component({
    templateUrl: 'vale-detail.html',
    //    directives: [forwardRef(() => ZarpoNavComponent), FooterComponent, MyDatePicker,
    //        ZarpoSliderComponent, ZarpoAccordianComponent, NoSpaceDirective, OnReturnDirective],
    //    providers: [LocalStorageService, UserDetailService, Rxjs, DateService,],
    //    pipes: [ValeKeysPipe]

})

export class ValeDetail {
    @ViewChild(Content) content: Content;
    @ViewChild('valeAnchor') valeAnchor: any;
    pageTitle: string;
    dateTitle: string = "Data de entrega";
    showIcon: boolean = true;
    zarpoIcon: boolean = false;
    path: string = "product";
    giftDate: string = "";
    giftDateMin: string;
    data: any = {
        product_id: "",
        user_token: "",
        group_id: "",
        is_ja: false
    };
    ifOffer: boolean = true;
    ifRules: boolean = false;
    ifPresentear: boolean = false;
    disclaimer: any = [];
    currentGroup: string;
    priceRange = 200;
    shownGroup: string;
    formsubmitted: boolean;
    ifSubmitted: boolean;
    firstname: string;
    surname: string;
    email: string;
    comment: string;
    reward: string;
    super_attribute: any;
    nav: NavController;
    navParams: NavParams;
    api: Rxjs;
    local: LocalStorageService;
    itemObject: any
    offers: any = [];
    valeForm: any;
    apiLoader: boolean = false;
    productRefresher: any;
    location: any;
    picker: boolean = false;
    myDatePickerOptions: any;
    minDate: string;

    customback: boolean = false;
    num: number = 0;
    constructor(private _nav: NavController, private _navParams: NavParams,
        public _events: Events, private _localStorageService: LocalStorageService,
        private _ajaxRxjs: Rxjs,
        private _fb: FormBuilder,
        private _userData: UserDetailService, private _errorhandler: errorhandler,
        private _checkReceiptService: CheckReceiptService,
        private _dateService: DateService,
        private events: Events
    ) {
        this.minDate = "2016-09-09";
        this.giftDate = "";
        this._dateService.getTomorrow().then((res) => {
            this.myDatePickerOptions = {
                dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sáb' },
                monthLabels: {
                    1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun',
                    7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
                },
                disableUntil: { year: res['year'], month: res['month'], day: res['date'] },
                sunHighlight: false,
                showIcon: true,
                dateTitle: this.dateTitle,
                dateFormat: 'dd-mm-yyyy',
                height: '34px',
                width: '100%'
            }
        });

        this.events.subscribe('custom:created', (item: any) => {
            console.log("custom back");
            this.backbutton();
        });
//        this.valeForm = this._fb.group({
//            firstname: ["", Validators.required],
//            lname: ["", Validators.required],
//            email: ["", Validators.required],
//            giftDate: ["", Validators.required],
//            comment: ["", Validators.required]
//        });

        this.valeForm = new FormGroup({
            firstname: new FormControl('', [
                Validators.maxLength(30),
                Validators.pattern('[a-zA-Z]*'),
                Validators.required
            ]),
            lname: new FormControl('', [
                Validators.maxLength(30),
                Validators.pattern('[a-zA-Z]*'),
                Validators.required
            ]),
            email: new FormControl('', [
                Validators.maxLength(50),
                EmailValidator.isValidMailFormat,
                Validators.required
            ]),
            giftDate: new FormControl('', [
                DateValidator.isValidDate,
                Validators.required
            ]),
            comment: new FormControl('', [
                Validators.required
            ]),
        });

        this._userData.fetchUserData().then((result: any) => {
            result.subscribe((response: any) => {
                this.reward = response.point_balance;
            });
        });
        this.nav = this._nav;
        this.navParams = this._navParams;
        this.api = this._ajaxRxjs;
        this.local = this._localStorageService;
        this.local.getValue('user_data').then((response) => {
            if (response) {
                this.data.user_token = response.data.user_token;
                this.data.group_id = response.data.group_id;
                this.data.product_id = this.navParams.get('id');
                this.apiLoader = true;
                this.getProductDetail();
            }
        });
        this.location = this.navParams.get('location');
        this.pageTitle = this.navParams.get('name');
    }
    onDateChanged(e: any) {
        this.giftDate = e.formatted;
    }
    showCalender() {
        console.log("show calender");
    }
    backbutton() {
        if (this.ifPresentear === true) {

            this.toggleGroup(this.currentGroup);
            this.ifRules = false;
            this.ifPresentear = false;
            this.ifOffer = true;
            this.customback = false;
        } else {

            console.log("diff");
            //            this._nav.pop();
        }
    }
    scrollToTop() {
        this.content.scrollToTop();
    }
    scrollToAnchor() {
        var anchorPos = this.valeAnchor.nativeElement['offsetTop'];
        this.content.scrollTo(0, anchorPos, 500);
    }

    getProductDetail() {
        this.api.ajaxRequest(this.path, this.data).subscribe((response: any) => {
            if (response.data) {
                this.itemObject = response.data;
                this.super_attribute = response.data.super_attribute;
                for (let key in this.itemObject.Vale) {
                    var obj = {
                        title: this.itemObject.Vale[key].title,
                        description: this.itemObject.Vale[key].description
                    }
                }
                this.disclaimer.push(this.itemObject.Regras['Regras'].description);
                this.apiLoader = false;
                this.refreshItems();
                let regras = {
                    checkin: this.itemObject.check_in,
                    checkout: this.itemObject.check_out,
                    rules: this.itemObject.Regras,
                    disclaimer:this.disclaimer
                };
                this.local.setValue('rules', regras);
            }
        }, (error) => {
            this._errorhandler.err(error);
            this.apiLoader = false;
            this.refreshItems();
        });
    }
    toggleGroup(group: string) {
        console.log(group);
        this.currentGroup = 'xxx';
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
            // set the location.hash to the id of
            // the element you wish to scroll to.
            if (true) {
                setTimeout(() => {
                    this.scrollToAnchor();
                }, 100)
            }
        } else {
            this.shownGroup = group;
            if (true) {
                setTimeout(() => {
                    this.scrollToTop();
                }, 100)
            }
        }
    }
    update(e: any) {
        console.log(e);
        //        if (true) {
        //            var barProgress = (e.target.max / e.target.offsetWidth) * (e.gesture.touches[0].screenX - e.target.offsetLeft);
        //        }
        //        this.itemObject.value = Math.ceil(barProgress / this.itemObject.step) * this.itemObject.step;
        //        $("#pricerange").val(this.itemObject.value);
    }

    isGroupShown(group: string) {
        return this.shownGroup === group;
    };
    calculateEMI(price: any) {
        var p = price
        var r = 0.0199
        var t = 1.0199;
        var n = 12;
        var pr = p * r;
        var rn = Math.pow(t, n);
        var prn = pr * rn;
        var div = rn - 1;
        var v = prn / div;
        return v.toFixed(2);
    }
    showOffer() {
        this.ifRules = false;
        this.ifOffer = true;
        this.ifPresentear = false;
    };
    showRules() {
        this.ifOffer = false;
        this.ifRules = true;
        this.ifPresentear = false;
    }
    refreshItems() {
        this.productRefresher = setTimeout(() => {
            //fetch product items
            this.getProductDetail();
        }, 18 * 60 * 1000);
    }
    showPresentear() {
        this.customback = true;
        console.log(this.customback);
        this.ifPresentear = true;
        this.ifOffer = false;
        this.ifRules = false;
    }
    modelChange() {
        this.ifSubmitted = false;
        this.formsubmitted = false;
    };
    sendPresent(form: any) {
        var firstname = form.controls.firstname;
        var lname = form.controls.lname;
        var email = form.controls.email;
        var comment = form.controls.comment;
        this.ifSubmitted = true;
        this.formsubmitted = true;
        console.log(firstname, lname, email, comment)
        // check the validation of fields
        if (firstname.value.trim().length < 1 || !firstname.valid ||
            lname.value.trim().length < 1 || !lname.valid ||
            email.value.trim().length < 1 || !email.valid ||
            comment.value.trim().length < 1 || !this.giftDate || this.giftDate == '') {

            return false;
        } else {

            var parcelData = {
                productType: "Vale",
                id: this.navParams.get('id'),
                firstname: form.controls.firstname.value,
                surname: form.controls.lname.value,
                email: form.controls.email.value,
                giftDate: this.giftDate,
                comment: form.controls.comment.value,
                reward: this.reward,
                giftName: this.itemObject.name,
                giftLocation: this.itemObject.location,
                giftPrice: this.itemObject.value,
                super_attribute: this.super_attribute
            };
            console.log(parcelData);
            this._checkReceiptService.setData(parcelData);
            this.nav.push(Receipt, parcelData);
        }
    }
    messageRestrictions(event: any) {
        var nums: number = 0;
        if (event.keyCode == 13 || event.KEYCODE_ENTER) {
            event.preventDefault();
            return false;
        } else if (event.keyCode == 32 || event.KEYCODE_SPACE) {
            if (this.comment.length > nums) {
                var last_char = this.comment.charAt(this.comment.length - 1);
                if (last_char == " ") {
                    event.preventDefault();
                    return false;
                }

            }
        }
    };
    ionViewWillLeave() {
        //stop refreshing of flash hotels 
        this.showRules();
        clearTimeout(this.productRefresher);
    }
}

