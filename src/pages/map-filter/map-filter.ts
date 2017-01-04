import {Events, NavParams, Content} from 'ionic-angular';
import {SebmGoogleMapMarker, SebmGoogleMap} from 'angular2-google-maps/core';
import {Component, AfterViewChecked, forwardRef, ViewChild} from '@angular/core';
import {errorhandler} from '../../services/error';
import {NavController} from 'ionic-angular';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {ZarpoSliderComponent} from '../../zarpo-slider/zarpo-slider.component';
import {ZarpoAccordianComponent} from '../../zarpo-accordian/zarpo-accordian.component';
import {ProductDeactivated} from '../product-deactivated/product-deactivated';
import {ProductClosed} from '../product-closed/product-closed';
import {calendar} from '../calendar/calendar';
import {CalenderClosed} from '../calender-closed/calender-closed';
import {Rxjs} from '../../services/Rxjs';
import {LocalStorageService} from '../../services/local-storage.service';
import {GeocoderService} from '../../services/geocoder.service';
import {CalenderService} from '../../services/calender.service';
import {KeysPipe} from '../../filters/keys/keys.pipe';
import {StringToNumberPipe} from '../../filters/keys/string-to-number.pipe';
@Component({
    templateUrl: 'map-filter.html'
})


export class MapFilter {
    @ViewChild(Content) content: Content;
    pageTitle: string="MAP";
    apiLoader:boolean=false;
    zarpoIcon: boolean = false;
    path: string = "product";
    locationPoints: {};
    lat: number = 51.678418;
    lng: number = 7.809007;
    iconUrl: string = "assets/img/marker.png";
    zoom = 8;
    gpsLocation: any = [];
    map: any;
    nav: NavController;
    navParams: NavParams;
    api: Rxjs;
    productRefresher: any;
    constructor(
        private _nav: NavController,
        private _navParams: NavParams,
        public _events: Events,
        private _localStorageService: LocalStorageService,
        private _ajaxRxjs: Rxjs,
        private _errorhandler: errorhandler,
        private _geoCode: GeocoderService,
        private _calenderService: CalenderService

    ) {
       
    }

    ionViewWillEnter() {
        console.log("Entered");
    }

    scrollToBottom(): void {
    }


    getProductDetail() {
        
    }
 
    //fetch data from booking api
    fetchCalenderData() {

    }
    
    refreshItems() {
    }

 
    ionViewWillLeave() {
        //stop refreshing of flash hotels 
    }
}

