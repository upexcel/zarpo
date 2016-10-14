import { Injectable } from '@angular/core';
declare var zarpoLayer: any;
@Injectable()
export class GoogleTagService {
    zarpoLayer: any;
    constructor() {
        this.zarpoLayer = zarpoLayer;
    }
    setScript5(pageType) {
        var script5: any = {}
        script5 = {
            pageType: 'flash',
            pageTag: pageType,
            event: 'pageDI'
        }
        //push to zarpo layer
        zarpoLayer.push(script5);
    }
    setScript5bis(pageType) {
        var script5: any = {}
        script5 = {
            event: 'flash noresult',
            noresultValue: pageType,
        }
        //push to zarpo layer
        zarpoLayer.push(script5);
    }
    setScript6(hotel: any) {
        var script6: {} = {};
        script6['event'] = 'enhancedEcom Impression';
        script6['ecommerce'] = {};
        script6['ecommerce']['impressions'] = [];
        var gtmObj = {
            hotel
        };
        if (hotel['attribute'] === "Hotel or room") {
            //            gtmObj.brand = "Hotel";
        } else if (hotel['attribute'] === "Pacote") {
            //            gtmObj.brand = "Pacote";
        } else if (hotel['attribute'] === "Giftcard") {
            //            gtmObj.brand = "Vale Presente";
        }
        script6['ecommerce']['impressions'].push(gtmObj);
        //push to zarpo layer
        zarpoLayer.push(script6);
    }
    setScript7(hotel: any, pos: number, name: any) {
        var script7 = {
            'event': 'enhancedEcom productClick',
            'click': {
                'actionField': {
                    'list': name
                },
                'products': []
            }
        };
        var gtm7Obj: {} = {};
        if (hotel['attribute'] === "Hotel or room") {
            gtm7Obj['brand'] = "Hotel";
        } else if (hotel['attribute'] === "Pacote") {
            gtm7Obj['brand'] = "Pacote";
        } else if (hotel['attribute'] === "Giftcard") {
            gtm7Obj['brand'] = "Vale Presente";
        }
        gtm7Obj['name'] = hotel.dl_name;
        gtm7Obj['id '] = hotel.hotel_id;
        gtm7Obj['category'] = hotel.dl_category;
        gtm7Obj['position'] = hotel.count;
        script7['click']['products'].push(gtm7Obj);
        //push to zarpo layer
        zarpoLayer.push(script7);
    }


}
