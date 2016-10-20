import {Component, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {ImageHeightService} from '../services/image-height.service';
import {GoogleTagService} from '../services/google-tag.service';
import {LocalStorageService} from '../services/local-storage.service';

import {HotelDetail} from '../pages/hotel-detail/hotel-detail';
import {PacoteDetail} from '../pages/pacote-detail/pacote-detail';
import {ValeDetail} from '../pages/vale-detail/vale-detail';
import {JaDetail} from '../pages/ja-detail/ja-detail';


@Component({
    selector: "zarpo-flash-card",
    templateUrl: 'flash-card.html',
    providers: [ImageHeightService]
    //    , GoogleTagService
})

export class FlashCardComponent {
    @Input() items: any;
    @Input() flashtype: string;
    @Input() tag: any;
    @Input() no_data: any
    public imgHeight: string;
    itemObject:boolean=false;
    constructor(
        private _nav: NavController,
        public _events: Events,
        private _img: ImageHeightService,
        public _gtm: GoogleTagService,
        private _localStorageService: LocalStorageService
    ) {
        this.getFlashImgHeight();

        setTimeout(() => {
            if (this.tag) {
                this.tagLoaded(this.items);
            } else {
                this.script();
            }
        }, 3000);

    }
    public obj: any = [];
    public objtag: any = [];
    script() {
        if (this.flashtype !== 'Ja') {
            this._localStorageService.getTimerStorage('allData').then((response: any) => {

                if (!response) {
                    setTimeout(() => {
                        this.script();
                    }, 2000);
                } else {
                    for (var i = 0; i < response.length; i++) {
                        if (this.flashtype == 'Hotel') {
                            if (response[i].attribute == 'Hotel or room') {
                                var data = {
                                    name: response[i].dl_name,
                                    id: response[i].hotel_id,
                                    brand: "Hotel",
                                    category: response[i].dl_category,
                                    position: this.obj.length,
                                    list: 'flash'
                                }
                                this.obj.push(data);
                            }
                        } else if (this.flashtype == 'Pacote') {
                            if (response[i].attribute == 'Pacote') {
                                var data = {
                                    name: response[i].dl_name,
                                    id: response[i].hotel_id,
                                    brand: this.flashtype,
                                    category: response[i].dl_category,
                                    position: this.obj.length,
                                    list: 'flash'
                                }
                                this.obj.push(data);
                            }
                        }
                        else if (this.flashtype == 'Vale') {
                            if (response[i].attribute == 'Giftcard') {
                                var data = {
                                    name: response[i].dl_name,
                                    id: response[i].hotel_id,
                                    brand: 'Vale Presente',
                                    category: response[i].dl_category,
                                    position: this.obj.length,
                                    list: 'flash'
                                }
                                this.obj.push(data);
                            }
                        }
                    }
                    this._gtm.setScript6(this.obj);
                }
            });
        } else {
            this._localStorageService.getTimerStorage('allDataJa').then((response) => {
                for (var i = 0; i < response.length; i++) {
                    var data = {
                        name: response[i].dl_name,
                        id: response[i].hotel_id,
                        brand: 'Zarpo Ja',
                        category: response[i].dl_category,
                        position: i,
                        list: 'flash'
                    }
                    this.obj.push(data);
                }
                this._gtm.setScript6(this.obj);
            });
        }
    }
    getFlashImgHeight() {
        this._img.getImageHeight().then((response) => {
            this.imgHeight = response + "px";
        });

    }

    displayDetailData(item: any, pos: number) {
        console.log(item);
        var paramData = {
            id: item.hotel_id,
            name: item.name,
            location: item.location,
        }
        var name;
        if (this.flashtype == 'Hotel') {
            console.log('Hotel')
            name = 'flash'
            this._localStorageService.setValue('is_ja', false);
            this._nav.push(HotelDetail, paramData);
        }
        if (this.flashtype == 'Pacote') {
            console.log('pacote')
            name = 'flash'
            this._localStorageService.setValue('is_ja', false);
            this._nav.push(PacoteDetail, paramData);
        }
        if (this.flashtype == 'Vale') {
            console.log('vale')
            name = 'flash'
            this._localStorageService.setValue('is_ja', false);
            this._nav.push(ValeDetail, paramData);
        }
        if (this.flashtype == 'Ja') {
            console.log('ja')
            name = 'flash'
            this._localStorageService.setValue('is_ja', true);
            this._nav.push(JaDetail, paramData);
        }
        if (this.tag) {
            if (this.tag.tags == 'location') {
                name = this.tag.name + '/////';
            } else if (this.tag.tags == 'thematictag') {
                name = '///' + this.tag.name + '//';
            } else if (this.tag.tags == 'checkin') {
                name = '////' + this.tag.name;
            } else if (this.tag.tags == 'multiple') {
                if (this.tag.name.thematic) {
                    name = this.tag.name.location + '//' + this.tag.name.thematic + '//';
                }
                else {
                    name = this.tag.name.location + '////' + this.tag.name.checkin;
                }
            }
        }

        if (this.no_data) {
            name = 'noresults';
        }
        console.log('hellosdfsdfsd', item, pos, name);

        this._gtm.setScript7(item, pos, name);

    }
    tagLoaded(item: any) {
        console.log('tag items', item);
        var name; var brand;
        if (this.flashtype == 'Hotel') {
            brand = 'Hotel'
        }
        else if (this.flashtype == 'Pacote') {
            brand = 'Pacote'
        }

        else if (this.flashtype == 'Ja') {
            brand = 'Zarpo Ja'
        }
        if (this.tag) {
            if (this.tag.tags == 'location') {
                name = this.tag.name + '/////';
            } else if (this.tag.tags == 'thematictag') {
                name = '///' + this.tag.name + '//';
            } else if (this.tag.tags == 'checkin') {
                name = '////' + this.tag.name;
            } else if (this.tag.tags == 'multiple') {
                if (this.tag.name.thematic) {
                    name = this.tag.name.location + '//' + this.tag.name.thematic + '//';
                }
                else {
                    name = this.tag.name.location + '////' + this.tag.name.checkin;
                }
            }
        }

        if (this.no_data == 'true') {
            name = 'noresults';
        }
        for (var i = 0; i < item.length; i++) {
            var data = {
                name: item[i].dl_name,
                id: item[i].hotel_id,
                brand: brand,
                category: item[i].dl_category,
                position: i,
                list: name
            }
            this.objtag.push(data);
        }
        console.log('hellosdfsdfsd', this.objtag);
        this._gtm.setScript6(this.objtag);
    }
}


