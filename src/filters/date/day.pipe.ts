import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({ name: 'day' })
export class DayPipe implements PipeTransform {
    transform(value: any): any {
        var mydate = new Date(Date.parse(value));
        var day: string;
        var dayNo = mydate.getDay();
        switch (dayNo) {
            case 0:
                day = "Domingo";
                break;
            case 1:
                day = "Segunda";
                break;
            case 2:
                day = "Terça";
                break;
            case 3:
                day = "Quarta";
                break;
            case 4:
                day = "Quinta";
                break;
            case 5:
                day = "Sexta";
                break;
            case 6:
                day = "Sábado";
                break;
        }
        return day;
    }
}