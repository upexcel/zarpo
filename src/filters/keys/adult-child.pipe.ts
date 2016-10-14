import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'adultChild' })
export class AdultChildPipe implements PipeTransform {
    transform(value: any): any {
        var arrObj = [];
        value = parseInt(value);
        if (value > 0) {
            for (var i = 0; i < value; i++) {

                var obj = {
                    name: i
                };
                arrObj.push(obj);
            }
        }

        return arrObj;
    }
}