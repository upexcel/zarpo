import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'valekeys' })
export class ValeKeysPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        let keys: any = [];
        for (let key in value) {
            var obj = {
                title: value[key].title,
                description: value[key].description
            }
            keys.push(obj);

        }
        return keys;
    }
}

