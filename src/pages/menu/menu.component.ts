import {NavController, MenuController, Events, Nav} from 'ionic-angular';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Network} from 'ionic-native';
import {HotelFlash} from '../hotel-flash/hotel-flash';
import {ValeFlash} from '../vale-flash/vale-flash';
import {OrderSuccess} from '../order-success/order-success';
import _ from 'lodash';
import {offline} from '../offline/offline';
import {Login} from '../login/login';
import {LocalStorageService} from '../../services/local-storage.service';
import {menuService} from '../../services/menu.service';
import {cancel} from '../cancel/cancel'
import {mordomo} from '../mordomo_zarpo/mordomo'
import {myAccount} from '../myAccount/myAccount'
import {invite} from '../inviteFriends/invite'
import {feedBack} from '../feedback/feedback'
import {Facebook} from 'ionic-native';
import {hotelTag} from '../hotelFilter/hotelTag';
import {Rxjs} from '../../services/Rxjs';
import {errorhandler} from '../../services/error';
@Component({
    templateUrl: 'menu.html',
})
export class menu implements OnInit {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = HotelFlash;
    ifHotelFilterOpen: boolean = true;
    ifPacoteFilterOpen: boolean = false;
    tagLocation: string = "";
    tagPension: string = "";
    tagThematic1: string = "";
    tagThematic2: string = "";
    tagPacoteLocation: string = "";
    tagPacoteThematic1: string = "";
    tagPacoteThematic2: string = "";
    events: Events;
    //    local: Storage;

    public date_data: any;

    public Thematic: any;
    public condition: boolean = false;
    locationTag: any; tagHotelPensionList: any; tagHotelThematic1List: any; tagHotelThematic2List: any;
    tagPacoteLocationList: any; tagPacoteThematic1List: any; tagPacoteThematic2List: any;
    constructor(
        private _nav: NavController,
        private _errorhandler: errorhandler,
        private _ajaxRxjs: Rxjs,
        private _events: Events,
        private _menu: MenuController,
        private _localStorage: LocalStorageService,
        private _menuService: menuService
    ) {
        this.rootPage = HotelFlash;
        this.events = this._events;
        console.log('checking root nav', this._nav);
        this._nav = _nav;
        //        this.local = new Storage(LocalStorage);
        if (this.pageT == 'Hotel') {
            this._localStorage.getValue('date_Hotel').then((response) => {
                this.min = response.first_checkin;
                this.max = response.last_checkin
                this.date_data = response.dates_collection;
            });
        }
        this._localStorage.getValue('datePlusMinus').then((response) => {
            console.log('for date plus minus', response);
            if (!response) {
                this.condition = false;
            } else {
                this.condition = response;
            }
        })
        console.log('sdsdds');
        this.dates('ja');
        this.dates('pacote');
    }

    ngOnInit() {
        this.start();
    }
    start() {

        if (this.fname == 'Pacotes') {

            this._localStorage.getValue('tag_pacote').then((response) => {

                this.locationTag = this._menuService.loadTags(response.location_tag);
                this.Thematic = this._menuService.loadTags(response.thematic_tag);
                console.log(this.locationTag)
                console.log(this.Thematic);

            });

            this._localStorage.getValue('date_pacote').then((response) => {
                this.min = response.first_checkin;
                this.max = response.last_checkin
                this.date_data = response.dates_collection;
            });

        } else if (this.fname == 'Hoties') {
            this._localStorage.getValue('tag_hotel').then((response) => {
                this.locationTag = this._menuService.loadTags(response.location_tag);
                this.Thematic = this._menuService.loadTags(response.thematic_tag);
                console.log(this.Thematic);
            });

            this._localStorage.getValue('date_Hotel').then((response) => {
                this.min = response.first_checkin;
                this.max = response.last_checkin
                this.date_data = response.dates_collection;
            });

        } else {

            this._localStorage.getValue('tag_ja').then((response) => {
                this.locationTag = this._menuService.loadTags(response.location_tag);
                this.Thematic = []

            });

            this._localStorage.getValue('date_ja').then((response) => {
                this.min = response.first_checkin;
                this.max = response.last_checkin
                this.date_data = response.dates_collection;
            });

        }
    }
    loadHotelTags() {
        this.ifHotelFilterOpen = true;
        this.ifPacoteFilterOpen = false;

    }
    loadPacoteTags() {
        this.ifPacoteFilterOpen = true;
        this.ifHotelFilterOpen = false;

    }
    i = 0; filter: boolean = false;
    showFilter() {
        if (this.i == 0) {
            this.filter = true
            this.i++;
        } else {
            this.filter = false
            this.i--;
        }
    }

    toggleChange(event: any) {
        this.condition = event._checked;
        this._localStorage.setValue('datePlusMinus', this.condition)
        console.log('toggle event', event._checked);
    }

    redirect(componentName: string) {
        console.log('menu clikkkkk', componentName);
        if (componentName == 'Hotel' || componentName == 'Pacote' || componentName == 'Ja') {
            this.nav.setRoot(HotelFlash, { hotelType: componentName });
        }
        else if (componentName == 'vale') {
            this.nav.setRoot(ValeFlash);
        }
        else if (componentName == 'cancel') {
            this.nav.setRoot(cancel);
        } else if (componentName == 'flash') {
            this.nav.setRoot(HotelFlash);
        } else if (componentName == 'contact') {
            this.nav.setRoot(mordomo);
        } else if (componentName == 'myaccount') {
            this.nav.setRoot(myAccount);
        } else if (componentName == 'invitefriends') {
            this.nav.setRoot(invite);
        } else if (componentName == 'feedback') {
            this.nav.setRoot(feedBack);
        }
        else if (componentName == 'success') {
            this.nav.setRoot(OrderSuccess);
        }

    }
    logout() {
        console.log("heeeeeeeee");
        this._localStorage.remove('flash_data');
        this._localStorage.remove('user_data');
        this._localStorage.remove('user_token');
        this._localStorage.remove('datePlusMinus');
        if (Network.connection && Network.connection !== 'none') {
            console.log(Network.connection);
            this._nav.setRoot(Login);
        }
        else {
            console.log(Network.connection);
            this._nav.setRoot(offline);
        }
        this.events.publish('user:logout', {});

        Facebook.logout();
    }
    //        onChange(event, id, val) {
    //            if (this.ifHotelFilterOpen) {
    //    
    //                setTimeout(() => {
    //                    this[val] = "";
    //                }, 200);
    //                this.nav.push(hotelTag, { value: event, name: id, flashType: 'Hotel' });
    //    
    //            }
    //            else {
    //                setTimeout(() => {
    //                    this[val] = "";
    //                }, 200);
    //                this.nav.push(hotelTag, { value: event, name: id, flashType: 'Pacote' });
    //    
    //            }
    //    
    //            this._menu.close();
    //        }
    public fname: any = 'Hoties'
    public pageT: any = 'Hotel';
    tnames(name, page) {

        this.fname = name;
        this.pageT = page;
        this.tagename = 'Destino';
        this.thematicName = 'Data de check-in';
        this.myDate = '';
        this.start();
        this.j--;
        this.filters = false
    }
    public tagename: any = 'Destino';
    public tagparamdata: any;
    public tagThematicdata: any;
    public thematicdata: any;
    tags(data, types) {
        this.tagparamdata = data;
        this.tagename = types;
        this.filtertag = false
        this.k--;
    }
    public thematicName: any = 'Data de check-in';

    thematic(data, themType) {
        this.myDate = '';
        this.thematicName = themType;
        this.thematicdata = data;
        this.filterdate = false
        this.l--;
    }
    tagselection() {

        if (this.tagename != 'Destino' && this.thematicName != 'Data de check-in') {
            if (this.myDate != '') {
                let a = this.myDate;
                var da: any = [];
                var selectdate: any;
                if (!this.condition) {
                    console.log(a);
                    selectdate = _.find(this.date_data, function(val, key) { return key == a });
                    console.log('tag param data', this.tagparamdata);
                    console.log('date data', selectdate);
                    da = _.intersection(this.tagparamdata.hotels, selectdate);
                    console.log('no of hotels', da)
                }
                else {

                    for (var i = -3; i <= 3; i++) {
                        let prevDate = this.dateformate(a, i);
                        selectdate = _.find(this.date_data, function(val, key) { return key == prevDate });
                        console.log(selectdate);
                        var alldate = _.intersection(this.tagparamdata.hotels, selectdate);
                        console.log(alldate, alldate.length)
                        for (var j = 0; j < alldate.length; j++) {
                            da.push(alldate[j]);
                        }
                        console.log('no of hotels', da)
                    }

                }
                this.nav.push(hotelTag, {
                    value: { hotels: da, location: this.tagparamdata.location },
                    flashType: this.pageT,
                    type: {
                        tags: 'multiple',
                        name: { location: this.tagename, checkin: this.thematicName }
                    }
                });
                this._menu.close();
            } else {
                console.log(this.thematicdata);
                let da = _.intersection(this.tagparamdata.hotels, this.thematicdata.hotels);
                this.nav.push(hotelTag, {
                    value: { 'hotels': da, location: this.thematicdata.location },
                    flashType: this.pageT,
                    type: {
                        tags: 'multiple',
                        name: { location: this.tagename, thematic: this.tagename }
                    }
                });
                this._menu.close();
            }


        }
        else if (this.tagename != 'Destino') {
            this.nav.push(hotelTag, { value: this.tagparamdata, flashType: this.pageT, type: { tags: 'location', name: this.tagename } });
            this._menu.close();
        }
        else if (this.thematicName != 'Data de check-in') {
            if (this.myDate != '') {
                let a = this.myDate;
                var da: any = [];
                var selectdate: any = [];
                if (!this.condition) {
                    this.thematicName = this.myDate;
                    selectdate = _.find(this.date_data, function(val, key) { return key == a });
                    this.nav.push(hotelTag, { value: { hotels: selectdate }, flashType: this.pageT, type: { tags: 'chekin', name: this.myDate } });
                } else {
                    for (var i = -3; i <= 3; i++) {
                        let prevDate = this.dateformate(a, i);
                        console.log(prevDate);
                        if (!prevDate) {
                            console.log('break');
                        } else
                            selectdate = _.find(this.date_data, function(val, key) { return key == prevDate });
                        for (var j = 0; j < selectdate.length; j++) {
                            da.push(selectdate[j]);
                        }


                    }
                    console.log('no of hotels', da)
                    this.nav.push(hotelTag, { value: { hotels: da }, flashType: this.pageT, type: { tags: 'chekin', name: this.myDate } });
                }

                this._menu.close();
            } else {
                this.nav.push(hotelTag, { value: this.thematicdata, flashType: this.pageT, type: { tags: 'thematictag', name: this.tagename } });
                this._menu.close();
            }

        }
        else if (this.fname) {
            this.nav.setRoot(HotelFlash, { hotelType: this.pageT });
            this._menu.close();
        }
    }
    dateformate(a, i) {
        let newdate = new Date(a);
        let aa = newdate.setDate(newdate.getDate() - i);
        var d: any = newdate.getDate();
        if (d < 10)
            d = "0" + d;
        var m: any = newdate.getMonth() + 1;
        if (m < 10)
            m = "0" + m;
        var y = newdate.getFullYear();
        let prevDate: any = y + "-" + m + "-" + d;
        console.log(prevDate, this.min)
        if (this.min > prevDate) {
            console.log('now min')
        } else {
            return prevDate;
        }
    }
    min: any;
    max: any;
    myDate: any;
    dates(page) {
        let api = 'date_details';
        let data = {
            date_site: page
        }
        this._ajaxRxjs.ajaxRequest(api, data).subscribe((response: any) => {
            this._localStorage.setValue('date_' + page, JSON.stringify(response))
        }, (error) => {
            this._errorhandler.err(error);
        });
    }
    datePicker() {
        this.thematicName = this.myDate;
        this.filterdate = false
        this.l--;
    }
    j = 0; k = 0; l = 0; filters: boolean = false; filtertag: boolean = false; filterdate: boolean = false;
    showFilters(name) {
        if (name == 'hotels') {
            if (this.j == 0) {
                this.filters = true
                this.j++;
            } else {
                this.filters = false
                this.j--;
            }
        }

        else if (name == 'tags') {
            if (this.k == 0) {
                this.filtertag = true
                this.k++;
            } else {
                this.filtertag = false
                this.k--;
            }
        }
        else if (name == 'dates') {
            if (this.l == 0) {
                this.filterdate = true
                this.l++;
            } else {
                this.filterdate = false
                this.l--;
            }
        }
    }
    cancelbt(cancelType) {
        if (cancelType == 'tag') {
            this.tagename = 'Destino';

        } else if (cancelType == 'date') {
            this.thematicName = 'Data de check-in';
            this.myDate = '';
        }

    }
}

