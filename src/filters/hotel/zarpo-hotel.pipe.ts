import { Pipe, PipeTransform } from '@angular/core';
import  _ from 'lodash';
@Pipe({ name: 'zarpoHotel' })
export class ZarpoHotelPipe implements PipeTransform {
    transform(value: any): any {
        var hotelData = _.remove(value, function(n: any) {
            if (n.attribute === "Hotel or room") {
                return n;
            }
        });
        return hotelData;

    }
}