import {errorhandler} from '../../services/error';
import {Component} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {FooterComponent} from '../../footer/footer.component';
import _ from 'lodash';
import {FlashCardComponent} from '../../flash-card/flash-card.component';
import {Rxjs} from '../../services/Rxjs';
import {LocalStorageService} from '../../services/local-storage.service';
import {ZarpoValePipe} from '../../filters/vale/zarpo-vale.pipe';
import {GoogleTagService} from '../../services/google-tag.service';
@Component({
    templateUrl: 'vale-flash.html',
//    directives: [ZarpoNavComponent, FooterComponent, FlashCardComponent],
//    pipes: [ZarpoValePipe]
})

export class ValeFlash {
    pageTitle: string = "Vale presentes";
    showBackButton: boolean = true;
    path: string = "flash";
    flashtype: string = 'Vale';
    data: any = {
        user_token: "",
        group_id: "",
        is_ja: false
    };
    nav: NavController;
    api: Rxjs;
    local: LocalStorageService;
    flashItems: any = [];
    page = 1;
    public refresh: boolean = false;
    apiLoader: boolean = false;
    flashRefresher: any;
    stopAjax: boolean = false;
    constructor(
        private _nav: NavController,
        private _localStorageService: LocalStorageService,
        private _ajaxRxjs: Rxjs,
        private _errorhandler: errorhandler,
        public _events: Events,
        private _gtm: GoogleTagService
    ) {
        this._gtm.setScript5('');
        this.nav = this._nav;
        this.api = this._ajaxRxjs;
        this.local = this._localStorageService;
        this.local.getValue('user_data').then((response) => {
            if (response) {
                this.data.user_token = response.data.user_token;
                this.data.group_id = response.data.group_id;
                this.data.page = this.page;
                this.data.page_type = "Giftcard"
                this.apiLoader = true;

            }
        });
    }
    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        let data = {
            user_token: this.data.user_token,
            group_id: this.data.group_id,
            page: this.page,
            page_type: "Giftcard",
            is_ja: false
        }

        this.getItems(data);

        console.log('Async operation has ended');
        infiniteScroll.complete();

    }
    getItems(data) {
        this.local.getTimerStorage('flash_data').then((response) => {
//            //value fetched from local storage
//            if (!response && response.length > 0) {
//                this.flashItems = response;
//                this.apiLoader = false;
//                this.refreshItems();
//            }
//            //fire api for data
//            else {
                this.api.ajaxRequest(this.path, data).subscribe((response: any) => {
                    if (data.page == 1) {
                        console.log('yes');
                        this.refresh = false;
                        this.flashItems = [];
                    }
                    if (response.data && response.data.length > 0 && response.data.length <= 5) {
                        //response fetched
                        this.page++;
                        console.log(this.page);
                        let data = {
                            user_token: this.data.user_token,
                            group_id: this.data.group_id,
                            page: this.page,
                            page_type: "Giftcard",
                            is_ja: false
                        }

                        if (!this.stopAjax) {
                            this.getItems(data);
                        }

                        _.map(response.data, (response) => {
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
                }, (error) => {
                    this._errorhandler.err(error);
                });
//
//            }
        });

    }
    ionViewWillEnter() {
        this.stopAjax = false;
        this.data.page = this.page;
        this.getItems(this.data);
    }
    ionViewWillLeave() {
        console.log("Looks like I'm about to leave :(");
        this.stopAjax = true;
    }
    refreshItems() {
        this.flashRefresher = setTimeout(() => {
            //delete local data and fetch items
            this.local.removeTimerStorage('flash_data');
            this.getItems(this.data);
        }, 18 * 60 * 1000);
    }
    doRefresh(refresher: any) {
        this.flashItems = [];
        this.page = 1;
        this.refresh = true;
        this.data.page = this.page;
        //delete local data and fetch items
        this.local.removeTimerStorage('flash_data');
        this.apiLoader = true;
        this.getItems(this.data);
        refresher.complete();
    }

    onPageWillLeave() {
        //stop refreshing of flash hotels 
        clearTimeout(this.flashRefresher);
    }
}

