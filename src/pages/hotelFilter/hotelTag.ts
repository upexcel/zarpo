import {Events} from 'ionic-angular';
import {Component, ViewChild, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {errorhandler} from '../../services/error';
import { Nav, NavController, NavParams} from 'ionic-angular';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import {mordomo} from '../mordomo_zarpo/mordomo';
import {FlashCardComponent} from '../../flash-card/flash-card.component';
import {HotelDetail} from '../hotel-detail/hotel-detail';
import {GoogleTagService} from '../../services/google-tag.service';
import {Rxjs} from '../../services/Rxjs';
import {LocalStorageService} from '../../services/local-storage.service';
import {tagPipe} from '../../filters/tag/tag.pipe';

@Component({
    templateUrl: 'hotelTag.html',
//    directives: [ZarpoNavComponent, FlashCardComponent, FooterComponent],
//    pipes: [tagPipe]
})

export class hotelTag {
    @ViewChild(Nav) nav: Nav;
    pageTitle: string;
    zarpoIcon: boolean = true;
    path: string = "flash";
    flashtype: string;
    data: any = {
        user_token: "",
        group_id: "",
        is_ja: false
    };

    navParams: NavParams;
    api: Rxjs;
    local: LocalStorageService;
    flashItems: any;
    apiLoader: boolean = false;
    flashRefresher: any;
    filterdata: any;
    filterPipe: any;
    constructor(
        private _nav: NavController,
        private _navParams: NavParams,
        public _events: Events,
        private _localStorageService: LocalStorageService,
        private _ajaxRxjs: Rxjs,
        private _errorhandler: errorhandler,
        private _gtm: GoogleTagService
    ) {
        this.filterPipe = new tagPipe();
        this._nav = this._nav;
        this.navParams = this._navParams;
        console.log('new nav', this.navParams);
        this.filterdata = this.navParams.data;
        this.pageTitle = this.navParams.data.value.location;
        this.flashtype = this.filterdata.flashType;
        this.api = this._ajaxRxjs;
        this.local = this._localStorageService;
        this.local.getValue('user_data').then((response) => {
            if (response) {
                this.data.user_token = response.data.user_token;
                this.data.group_id = response.data.group_id;
                this.apiLoader = true;
                this.getItems();
            }
        });
        this._events.subscribe('hotel:detail', (item: any) => {

            this.displayDetailItem(item[0]);
        });
        this._events.subscribe('pacote:detail', (item: any) => {
            this.displayDetailItem(item[0]);
        });
    }
    getItems() {
//        if (this.filterdata.flashType == 'Ja') {
//            this.local.getTimerStorage('allDataJa').then((response) => {
//                //value fetched from local storage
//                if (response && response.length > 0) {
//                    this.flashItems = response;
//                    this.apiLoader = false;
//                    this.refreshItems();
//                    this.pipedata();
//
//                }
//                //fire api for data
//                else {
//                    this.data.is_ja = true;
//                    this.api.ajaxRequest(this.path, this.data).subscribe((response: any) => {
//                        if (response.data && response.data.length > 0) {
//                            //response fetched
//                            this.local.setTimerStorage("allData", response.data, 0.15);
//                            this.flashItems = response.data;
//                            this.apiLoader = false;
//                            this.refreshItems();
//                            this.pipedata();
//                        }
//                    }, (error) => {
//                        this._errorhandler.err(error);
//                    });
//
//                }
//            });
//        } else {
//            this.local.getTimerStorage('allData').then((response) => {
//                //value fetched from local storage
//                if (response && response.length > 0) {
//                    this.flashItems = response;
//                    this.apiLoader = false;
//                    this.refreshItems();
//                    this.pipedata();
//
//                }
//                //fire api for data
//                else {
//                    this.api.ajaxRequest(this.path, this.data).subscribe((response: any) => {
//                        if (response.data && response.data.length > 0) {
//                            //response fetched
//                            this.local.setTimerStorage("allData", response.data, 0.15);
//                            this.flashItems = response.data;
//                            this.apiLoader = false;
//                            this.refreshItems();
//                            this.pipedata();
//                        }
//                    }, (error) => {
//                        this._errorhandler.err(error);
//                    });
//
//                }
//            });
//
//        }

    }
    public no_data: any; public tagType: any;
    pipedata() {
        console.log('filter data', this.filterdata);
        let pipeuse = this.filterPipe.transform(this.flashItems, this.filterdata);
        console.log('this pipe is from controller', pipeuse);
        this.flashItems = pipeuse.data;
        this.no_data = pipeuse.no_data;
        this.tagType = pipeuse.tagType;
        var name;
        if (this.tagType) {
            if (this.tagType.tags == 'location') {
                name = this.tagType.name + '/////';
            } else if (this.tagType.tags == 'thematictag') {
                name = '///' + this.tagType.name + '//';
            } else if (this.tagType.tags == 'checkin') {
                name = '////' + this.tagType.name;
            } else if (this.tagType.tags == 'multiple') {
                if (this.tagType.name.thematic) {
                    name = this.tagType.name.location + '//' + this.tagType.name.thematic + '//';
                }
                else {
                    name = this.tagType.name.location + '////' + this.tagType.name.checkin;
                }

            }

        }
        if (this.no_data == 'true') {
            name = 'noresults';
            if (this.tagType.name.thematic) {
                var bis = this.tagType.name.location + '//' + this.tagType.name.thematic + '//';
            }
            else {
                var bis = this.tagType.name.location + '////' + this.tagType.name.checkin;
            }
            this._gtm.setScript5bis(bis);
        }

        this._gtm.setScript5(name);

    }
    displayDetailItem(item: any) {
        alert('hello');
        var paramData = {
            id: item.hotel_id,
            name: item.name,
            location: item.location,
        }
        this.nav.push(HotelDetail, paramData);
    }
    refreshItems() {
        this.flashRefresher = setTimeout(() => {
            //delete local data and fetch items
            this.local.removeTimerStorage('allData');
            this.getItems();
        }, 18 * 60 * 1000);
    }
    doRefresh(refresher: any) {
        console.log('hello');
        this.flashItems = [];
        //delete local data and fetch items
        this.local.removeTimerStorage('allData');
        this.apiLoader = true;
        this.getItems();
        refresher.complete();
    }

    onPageWillLeave() {
        //stop refreshing of flash hotels 
        clearTimeout(this.flashRefresher);
    }
    contact() {
        console.log('hello');
                this._nav.push(mordomo);
    }
}

