import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({ name: 'stringToDate' })
export class DateDayPipe implements PipeTransform {
    transform(value: any): any {
        new Date(value);
        return new Date(value);

    }
}