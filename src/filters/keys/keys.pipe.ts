import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        let keys: any = [];
        for (let key in value) {
            var a = value[key]['description'];
            if ((!!a) && (a.constructor === Array)) {
                var obj = {
                    title: key,
                    detail: value[key]['description']
                }
                keys.push(obj);

            }
            else {

                var myarray = [];
                for (let key in a) {
                    var desc = a[key];
                    myarray.push(desc);
                }
                var obj1 = {
                    title: key,
                    detail: myarray
                }
                keys.push(obj1);
            }

        }
        return keys;
    }
}