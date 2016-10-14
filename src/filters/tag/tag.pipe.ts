import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({ name: 'hotelTag' })
export class tagPipe implements PipeTransform {
    transform(list: any, exponent: any): any {

        var filterdata = {
            data: [],
            no_data: '',
            tagType: exponent.type
        };
        var filter = []
        if (exponent.value.hotels) {
            console.log('hrllo', exponent);
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    console.log(list[i].hotel_id);
                    if (exponent.value.hotels.indexOf(list[i].hotel_id) != -1) {
                        filter.push(list[i]);
              
                    }
                }
            }
            if (filter.length == 0) {
                if (exponent.flashType == 'Hotel' || exponent.flashType == 'Ja') {
                    for (var i = 0; i < list.length; i++) {
                        if (i < 20) {
                            filter.push(list[i]);
                        }
                    }
                    filterdata.data = filter;
                    filterdata.no_data = 'true';
                    return filterdata;
                } else if (exponent.flashType == 'Pacote') {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].attribute == "Pacote") {
                            if (filter.length < 20) {
                                filter.push(list[i]);
                            }
                        }
                    }
                    filterdata.data = filter;
                    filterdata.no_data = 'true';
                    return filterdata;
                }
            } else {
                filterdata.data = filter;
                filterdata.no_data = 'false';
                return filterdata;
            }
        } else {
            if (exponent.flashType == 'Hotel' || exponent.flashType == 'Ja') {
                for (var i = 0; i < list.length; i++) {
                    if (i < 20) {
                        filter.push(list[i]);
                    }
                }
                filterdata.data = filter;
                filterdata.no_data = 'true';
                return filterdata;
            } else if (exponent.flashType == 'Pacote') {
                for (var i = 0; i < list.length; i++) {

                    if (list[i].attribute == "Pacote") {
                        if (filter.length < 20) {
                            filter.push(list[i]);
                        }
                    }
                }
                filterdata.data = filter;
                filterdata.no_data = 'true';
                return filterdata;
            }
        }
    }
}

