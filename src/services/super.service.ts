import { Injectable } from '@angular/core';
import  _ from 'lodash';
@Injectable()
export class SuperService {
    super: any;
    constructor() {
    }
    convert(data: any) {
        var rawdta: any;
        _.each(data, function(value, key) {
            var mystr = value.replace("super_attribute", "");
            mystr = mystr.substring(1, mystr.length - 1);
            rawdta = mystr.split("][");
        });
        this.super = rawdta;
        return Promise.resolve(this.super);
    };

}
