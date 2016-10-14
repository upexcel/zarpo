import {Events, NavParams, Content} from 'ionic-angular';

import {Component, ViewChild, forwardRef} from '@angular/core';


import {GOOGLE_MAPS_PROVIDERS, GOOGLE_MAPS_DIRECTIVES, GoogleMapsAPIWrapper, SebmGoogleMapMarker, SebmGoogleMap} from 'angular2-google-maps/core';

import _ from 'lodash';

import {errorhandler} from '../../services/error';
import {NavController} from 'ionic-angular';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {ZarpoSliderComponent} from '../../zarpo-slider/zarpo-slider.component';
import {ZarpoAccordianComponent} from '../../zarpo-accordian/zarpo-accordian.component';
import {ProductDeactivated} from '../product-deactivated/product-deactivated';
import {ProductClosed} from '../product-closed/product-closed';
import {CalenderClosed} from '../calender-closed/calender-closed';
import {Rxjs} from '../../services/Rxjs';
import {LocalStorageService} from '../../services/local-storage.service';
import {GeocoderService} from '../../services/geocoder.service';
import {CalenderService} from '../../services/calender.service';
import {calendar} from '../calendar/calendar';
import {KeysPipe} from '../../filters/keys/keys.pipe';

import {StringToNumberPipe} from '../../filters/keys/string-to-number.pipe';


@Component({
    templateUrl: 'ja-detail.html',

    //    directives: [forwardRef(() => ZarpoNavComponent), FooterComponent,
    //
    //        ZarpoSliderComponent, ZarpoAccordianComponent, GOOGLE_MAPS_DIRECTIVES, SebmGoogleMap, SebmGoogleMapMarker],
    //    providers: [GeocoderService],

    //    pipes: [KeysPipe, StringToNumberPipe]

})

export class JaDetail {
    @ViewChild(Content) content: Content;
    pageTitle: string;
    zarpoIcon: boolean = false;
    path: string = "product";
    locationPoints: {};
    data: any = {
        product_id: "",
        user_token: "",
        group_id: "",
        is_ja: true
    };

    iconUrl: string = "../img/marker.png";
    zoom = 8;
    gpsLocation: any = [];


    ifOffer: boolean = true;
    ifRules: boolean = false;
    ifMaps: boolean = false;
    ifDates: boolean = false;
    disclaimer: any = [];
    productClosed: boolean = false;
    calenderClosed: boolean = false;
    productDeactivated: boolean = false;
    nav: NavController;
    navParams: NavParams;
    api: Rxjs;
    local: LocalStorageService;
    itemObject: any
    offers: any = [];
    apiLoader: boolean = false;
    productRefresher: any;

    location: any;

    constructor(private _nav: NavController, private _calenderService: CalenderService, private _geoCode: GeocoderService, private _navParams: NavParams, public _events: Events, private _localStorageService: LocalStorageService, private _ajaxRxjs: Rxjs, private _errorhandler: errorhandler) {
        this.nav = this._nav;
        this.navParams = this._navParams;
        this.api = this._ajaxRxjs;
        this.local = this._localStorageService;

    }
    ionViewWillEnter() {
        console.log("enter");
        //stop refreshing of flash hotels 
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
        this.showOffer();
    }
    getProductDetail() {
        this.api.ajaxRequest(this.path, this.data).subscribe((response: any) => {
            if (response.data) {
                this.itemObject = response.data;

                if (response.data.gps_coordinates) {
                    this.gpsLocation = response.data.gps_coordinates;
                }
                console.log(this.gpsLocation);
                if (this.gpsLocation.length > 0 && this.gpsLocation.length < 2) {
                    this.zoom = 13;
                }
                else if (this.gpsLocation.length > 0 && this.gpsLocation.length >= 2) {
                    alert(1);
                    this.zoom = 5;
                }
                else {
                    //if gpd co-ordinates are not found then ftch from geocoder
                    console.log("called");
                    this.zoom = 13;
                    this.getPoints(this.itemObject);
                }

                this.fetchCalenderData();
                if (this.itemObject.product_closed && this.itemObject.product_closed !== "") {
                    this.productClosed = true
                }
                if (this.itemObject.product_deactivated && this.itemObject.product_deactivated !== "") {
                    this.productDeactivated = true
                }
                if (this.itemObject.check_in == 'No') {
                    this.calenderClosed = true;
                }
                this.disclaimer.push(this.itemObject.Regras['Regras_do_Hotel'].description);
                this.disclaimer.push(this.itemObject.Regras['Pol&#237;tica_de_cancelamento'].description);
                this.apiLoader = false;
                this.refreshItems();
                let regras = {
                    checkin: this.itemObject.check_in,
                    checkout: this.itemObject.check_out,
                    rules: this.itemObject.Regras
                };
                this.local.setValue('rules', regras);
            }
        }, (error) => {
            this._errorhandler.err(error);
            this._errorhandler.err(error);
            this.apiLoader = false;
            this.refreshItems();
        });
    }
    getPoints(object: any) {
        var address = object.name + " " + object.city + " " + object.state + " " + object.country;
        this._geoCode.fetchPoints(address).subscribe((response: any) => {
            if (response) {
                //response fetched
                this.locationPoints = response.results[0].geometry.location;

                console.log(this.locationPoints);
                var obj = {
                    lat: this.locationPoints['lat'],
                    lang: this.locationPoints['lng']
                }
                //{lat: -8.5066086, lng: -35.0056865}
                this.gpsLocation.push(obj);

            }
        }, (error) => {
            this._errorhandler.err(error);
        });
    }
    fetchCalenderData() {
        //fetch data from booking api
        this._calenderService.fetchCalenderData(this.navParams.get('id'), this.data['is_ja'])
        //        .subscribe((res: any) => {
        //            console.log(res);
        //        });
    }
    showOffer() {
        this.ifRules = false;
        this.ifMaps = false;
        this.ifOffer = true;
        this.ifDates = false;
    };
    showRules() {
        this.ifMaps = false;
        this.ifOffer = false;
        this.ifRules = true;
        this.ifDates = false;
    }
    showMap() {
        this.ifRules = false;
        this.ifOffer = false;
        this.ifMaps = true;
        this.ifDates = false;
    }
    refreshItems() {
        this.productRefresher = setTimeout(() => {
            //fetch product items
            this.getProductDetail();
        }, 18 * 60 * 1000);
    }
    showCalender() {
        //if all ok
        if (this.productClosed == false && this.productDeactivated == false && this.calenderClosed == false) {
            //            $state.go("menu.checkout/:name/:id/:location", { name: self.base.name, id: $stateParams.id, location: self.base.location });
            let paramdata = {
                id: this.navParams.get('id'),
                name: this.pageTitle,
                is_ja: true,
                location: this.location,
                flashType: 'Ja'
            }
            this.nav.push(calendar, paramdata)
        }
        //if product is closed
        else if (this.productClosed == true) {
            this.nav.push(ProductClosed, { flashType: 'Ja' });
        }

        //if calender is paused/closed
        else if (this.calenderClosed == true) {
            var data = {
                name: this.navParams.get('name'),
                id: this.navParams.get('id'),
                location: this.navParams.get('location')
            }
            this.nav.push(CalenderClosed, data);
        }
        //if product is deactivated
        else if (this.productDeactivated == true) {
            this.nav.push(ProductDeactivated);
        }
    }
    ionViewWillLeave() {
        //stop refreshing of flash hotels 
        clearTimeout(this.productRefresher);
    }
}

