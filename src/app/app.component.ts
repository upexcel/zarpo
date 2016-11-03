import {App, Platform, Nav, NavController, Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Component, ViewChild, Inject} from '@angular/core';
import {Location, LocationStrategy, HashLocationStrategy} from '@angular/common';
//import {DomSanitizationService} from '@angular/platform-browser';
import {GoogleTagService} from '../services/google-tag.service';
import {StatusBar, GoogleAnalytics,BackgroundMode} from 'ionic-native';
import {Login} from '../pages/login/login';
import {menu} from '../pages/menu/menu.component';
//import * as localforage from "localforage";
import {HotelFlash} from '../pages/hotel-flash/hotel-flash';
import {offline} from '../pages/offline/offline';
import {Network, Keyboard, InAppBrowser} from 'ionic-native';

//services
import {menuService} from '../services/menu.service';
import {Rxjs} from '../services/Rxjs';
import {CalenderService} from '../services/calender.service';

import {LocalStorageService} from '../services/local-storage.service';
import {UserDetailService} from '../services/user-detail.service';
import {GuestDetailService} from '../services/guest-detail.service';
import {CheckSelectedService} from '../services/check-selected.service';
import {CheckReceiptService} from '../services/check-receipt.service';


import {errorhandler} from '../services/error';
import {facebookLogin} from '../services/fbLogin';
//filters
//import {GOOGLE_MAPS_PROVIDERS, provideLazyMapsAPILoaderConfig} from 'angular2-google-maps/core';

@Component({
    template: '<ion-nav #myNav [root]="rootPage"></ion-nav>',
})
export class MyApp {
    @ViewChild('myNav') nav: NavController
    rootPage: any;

    moipObj: any;
    user_login: boolean = false;
    events: Events;
    constructor(
        platform: Platform,
        public local: Storage,
        private _events: Events,
        private _calenderService: CalenderService,
        private _guestDetailService: GuestDetailService,
        private _checkSelectedService: CheckSelectedService,
        private _checkreceiptService: CheckSelectedService,
        private _ajaxRxjs: Rxjs,
        //        private _sanitizer: DomSanitizationService,
        private _errorhandler: errorhandler,
        app: App
    ) {
        this.events = _events;
        //        this.local = new Storage(LocalStorage);
        //        this.rootPage = Login;
        this.hotelTags();
        this.pacote();
        this.ja();
        this.date();
        platform.ready().then(() => {
            console.log('checking');
            BackgroundMode.enable();
            
            this.local.get('user_data').then((data) => {
                if (Network.connection && Network.connection !== 'none') {
                    console.log('checking2', data, Network.connection);
                    if (data) {
                        this.rootPage = menu;
                    } else {
                        this.rootPage = Login;
                    }
                }
                else {
                    console.log('checking3', Network.connection);
                    this.rootPage = offline;
                }

            });
            //window.addEventListener('click', clickMe, false);
            function clickMe(e) {
                e.preventDefault();
                e = e || window.event;
                var element = e.target || e.srcElement;
                if (element.tagName == 'A' || element.tagName == 'a' ||
                    element.parentElement.tagName == 'A' || element.parentElement.tagName == 'a') {

                    if ((element.href && element.href.length > 5) || (element.parentElement.href && element.parentElement.href.length > 5)) {
                        var url = element.parentElement.href || element.href;
                        window.open(url, "_blank", "location=yes");
                        return false; // prevent default action and stop event propagation 
                    }

                }
            };


            //            StatusBar.hide();
            Keyboard.hideKeyboardAccessoryBar(false);
            Keyboard.disableScroll(false);
            GoogleAnalytics.debugMode();
            GoogleAnalytics.startTrackerWithId('UA-62977551-2');
            GoogleAnalytics.enableUncaughtExceptionReporting(true)
                .then((_success) => {
                }).catch((_error) => {
                });
        });
        this.addConnectivityListeners();
        this.keyBoardListeners();
        console.log(BackgroundMode.isEnabled());

    }
    ngAfterViewInit() {
        // Let's navigate from TabsPage to Page1
    }
    keyBoardListeners() {
        Keyboard.onKeyboardShow().subscribe(() => {
            console.log("keyboard opennnn");
        });
        Keyboard.onKeyboardHide().subscribe(() => {
            console.log("keyboard hideeeee");
        });
    }
    addConnectivityListeners() {

        var onOnline = () => {
            Network.onConnect().subscribe(() => {
                //                setTimeout(() => {
                if (Network.connection) {
                    this.nav.pop();
                }
                //                }, 300);

            });
        };

        var onOffline = () => {
            Network.onDisconnect().subscribe(() => {
                //                setTimeout(() => {
                this.nav.push(offline);
                //                }, 300);
            });
        };

        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);

    }

    hotelTags() {
        let api = 'tag_details';
        let data = {
            tag_site: "zarpo"
        }
        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
            this.local.set('tag_hotel', JSON.stringify(response.data));
        }, (error) => {
            this._errorhandler.err(error);
        });
    }
    pacote() {
        let api = 'tag_details';
        let data = {
            tag_site: "pacote"
        }
        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
            this.local.set('tag_pacote', JSON.stringify(response.data))
        }, (error) => {
            this._errorhandler.err(error);
        });
    }
    ja() {
        let api = 'tag_details';
        let data = {
            tag_site: "ja"
        }
        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
            this.local.set('tag_ja', JSON.stringify(response.data))
        }, (error) => {
            this._errorhandler.err(error);
        });
    }
    date() {
        let api = 'date_details';
        let data = {
            date_site: "hotel"
        }
        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
            this.local.set('date_Hotel', JSON.stringify(response))
        }, (error) => {
            this._errorhandler.err(error);
        });
    }

}




