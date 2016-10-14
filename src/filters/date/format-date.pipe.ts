import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
    transform(dateitem: any): any {
        //if not blank
        if (dateitem) {
            //if holds date
            if (dateitem !== '1. Data de entrada' && dateitem !== 'Data de saída') {
                var dateElement = dateitem.split("-");
                var dmy = dateElement[2] + "/" + dateElement[1] + "/" + dateElement[0];
                return dmy;
            }
            //if it holds tab label
            else {
                return dateitem;
            }

        }
        else {
            return dateitem;
        }
    }
}