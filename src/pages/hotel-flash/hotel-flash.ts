import {Events} from 'ionic-angular';
import {Component, Input, OnChanges, Output, forwardRef} from '@angular/core';
import {errorhandler} from '../../services/error';
import { NavController, NavParams, ViewController} from 'ionic-angular';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';

import {FlashCardComponent} from '../../flash-card/flash-card.component';
import {HotelDetail} from '../hotel-detail/hotel-detail';
import {GoogleTagService} from '../../services/google-tag.service';
import {Rxjs} from '../../services/Rxjs';
import {LocalStorageService} from '../../services/local-storage.service';
import {ZarpoHotelPipe} from '../../filters/hotel/zarpo-hotel.pipe';
import _ from 'lodash';
@Component({
    templateUrl: 'hotel-flash.html',
    //    directives: [FlashCardComponent, FooterComponent, forwardRef(() => ZarpoNavComponent)],
    //    pipes: [ZarpoHotelPipe]

})

export class HotelFlash {
    pageTitle: string = "Hotéis";
    zarpoIcon: boolean = true;
    path: string = "flash";
    flashtype: string = 'Hotel';
    data: any = {
        user_token: "",
        group_id: "",
        is_ja: false
    };
    storeClosed: boolean = false;
    stopAjax: boolean = false;
    nav: NavController;
    navParams: NavParams;
    api: Rxjs;

    flashItems: any = [];
    apiLoader: boolean = true;
    flashRefresher: any;
    itemss: any = [];
    page = 1;
    public refresh: boolean = false;
    data_button: any = ''
    nodata: boolean = false;
    constructor(
        private _nav: NavController,
        private _navParams: NavParams,
        public _events: Events,
        public local: LocalStorageService,
        private _ajaxRxjs: Rxjs,
        private _errorhandler: errorhandler,
        private _gtm: GoogleTagService,
        public viewCtrl: ViewController
    ) {
        //        console.log('checking root nav', this._nav);
        this._gtm.setScript5('');
        //        console.log('testing testing')
        this.nav = this._nav;
        this.api = this._ajaxRxjs;
        if (this._navParams.get('hotelType')) {
            this.flashtype = this._navParams.get('hotelType');
        }
        console.log('param data', this._navParams)
        this.local = this.local;
        setTimeout(() => {
            this.local.getValue('user_data').then((response) => {
                //                console.log('user response', response);
                if (response) {
                    //                    console.log('user data for testing', response);
                    this.data.user_token = response.data.user_token;
                    this.data.group_id = response.data.group_id;
                    this.data.page = this.page;
                    //set page type and is ja value according to link
                    if (this.flashtype == 'Hotel') {
                        this.data.page_type = "Hotel or room";
                        this.data.is_ja = false;
                        this.pageTitle = 'Hotéis';
                    }
                    else if (this.flashtype == 'Pacote') {
                        this.data.page_type = "Pacote";
                        this.data.is_ja = false;
                        this.pageTitle = 'Pacotes';
                    }
                    else {
                        this.data.page_type = "Hotel or room";
                        this.data.is_ja = true;
                        this.pageTitle = 'ZARPO JÁ';
                    }

                    this.apiLoader = true;
                    //                    console.log('this data for testing', this.data);
                    let allData = {
                        user_token: this.data.user_token,
                        group_id: this.data.group_id,
                        is_ja: false
                    }
                    this.alldata(allData);
                    let allDataja = {
                        user_token: this.data.user_token,
                        group_id: this.data.group_id,
                        is_ja: true
                    }
                    this.alldata(allDataja);
                    this.local.getValue('product').then((response) => {
                        //                        console.log("thissadddddddddddddasd", response)
                        if (!response) {

                            //                            console.log("this is constructor", response)
                            this.getItems(this.data);

                        }
                    });
                }
            });
        }, 300);

        this._events.subscribe('user:logout', (user) => {
            //            console.log("Logged out");
            this.userLoggedout();
        });
    }
    userUpdated(user) {
        // Handle the event
        console.log(user);
    }
    doInfinite(infiniteScroll) {
        let data = {
            user_token: this.data.user_token,
            group_id: this.data.group_id,
            page: this.page,
            page_type: "Hotel or room",
            is_ja: false
        }

        this.getItems(data);
        infiniteScroll.complete();

    }
    //calling to prefetch data to store in local-storege for filters
    alldata(allData: any) {
        this.local.getTimerStorage('allData').then((response) => {

            if (response && response.length > 0) {

            } else {
                //                console.log('data checking', response);
                this.api.ajaxRequest(this.path, allData).subscribe((response: any) => {
                    //                    console.log(response);
                    if (response.data && response.data.length > 0) {
                        if (!allData.is_ja) {
                            this.local.setTimerStorage("allData", response.data, 0.15);
                        } else {
                            this.local.setTimerStorage("allDataJa", response.data, 0.15);
                        }
                    }
                }, (error) => {
                    this._errorhandler.err(error);
                });
            }
        })
    }
    ionViewWillEnter() {
        this.stopAjax = false;
        this.data.page = this.page;
        this.local.getValue('product').then((response) => {
            //            console.log('checking for response', response)
            if (response == 'detailPage') {
                this.getItems(this.data);
                this.local.remove('product');
            }
        });
    }

    getItems(data: any) {
        //        this.local.getTimerStorage('flash_data').then((response) => {
        //
        //
        //            //valresponseue fetched from local storage
        //            if (response && response.length > 0) {
        //                this.flashItems = response;
        //                this.apiLoader = false;
        //                this.refreshItems();
        //            }
        //            //fire api for data
        //            else {
        this.api.ajaxRequest(this.path, data).subscribe((response: any) => {
            if (data.page == 1) {
                //                console.log('yes');
                this.refresh = false;
                this.flashItems = [];
            }
            if (response.data && response.data.length > 0 && response.data !== 'ja store closed.') {
                this.page++;

                let data: any = {
                    user_token: this.data.user_token,
                    group_id: this.data.group_id,
                    page: this.page
                }
                if (this.flashtype == 'Hotel') {
                    data.page_type = "Hotel or room";
                    data.is_ja = false;
                } else if (this.flashtype == 'Pacote') {
                    data.page_type = "Pacote";
                    data.is_ja = false;
                } else {
                    data.page_type = "Hotel or room";
                    data.is_ja = true;
                }
                if (!this.stopAjax) {
                    this.getItems(data);
                }
                _.map(response.data, (response) => {
                    this.data_button = '';
                    this.flashItems.push(response);

                });

                if (this.refresh) {
                    this.apiLoader = true
                } else {
                    this.apiLoader = false;
                    this.refresh = false;
                }
                this.refreshItems();
            }
            else {
                console.log('no data');
                this.stopAjax = true;
                this.nodata = true;
                if (response.data && response.data === 'ja store closed.') {

                    this.storeClosed = true;
                }
            }
        }, (error) => {
            this._errorhandler.err(error);
        });
        //
        //            }
        //        });

    }
    //    newData() {
    //        this.data_button = "Aguarde"
    //        console.log('new data is calling');
    //        this.stopAjax = false;
    //        this.data.page = this.page;
    //
    //        setTimeout(() => {
    //            this.getItems(this.data);
    //        }, 400);
    //    }

    displayDetailItem(item: any) {
        var paramData = {
            id: item.hotel_id,
            name: item.name,
            location: item.location,
        }
        this.stopAjax = true;
        this.nav.push(HotelDetail, paramData);
    }
    refreshItems() {
        this.flashRefresher = setTimeout(() => {
            //delete local data and fetch items
            this.local.removeTimerStorage('flash_data');
            this.getItems(this.data);
        }, 18 * 60 * 1000);
    }
    doRefresh(refresher: any) {
        //        console.log('hello i am refresing');
        this.apiLoader = true;
        this.flashItems = [];
        this.refresh = true;
        this.page = 1;
        this.data.page = this.page;
        //delete local data and fetch items
        this.local.removeTimerStorage('flash_data');

        this.getItems(this.data);
        refresher.complete();
    }

    redirectToHotel() {
        this.flashItems = [];
        this.data.page_type = "Hotel or room";
        this.data.is_ja = false;
        this.pageTitle = 'Hotéis';
        this.getItems(this.data);
    }

    ionViewWillLeave() {
        //        console.log("view");
        this.userLoggedout();
    }
    onPageWillLeave() {
        //        console.log("page");
        this.userLoggedout();
    }
    userLoggedout() {
        //        console.log("Stopped");
        //stop refreshing of flash hotels 
        this.stopAjax = true;

        clearTimeout(this.flashRefresher);
    }

}
