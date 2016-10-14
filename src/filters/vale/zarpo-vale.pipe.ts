import { Pipe, PipeTransform } from '@angular/core';
import  _ from 'lodash';
@Pipe({ name: 'zarpoVale' })
export class ZarpoValePipe implements PipeTransform {
    transform(value: any): any {
        var valeData = _.remove(value, function(n:any) {
            if (n.attribute === "Giftcard") {
                return n;
            }
        });
        return valeData;

    }
}