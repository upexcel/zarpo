import { Pipe, PipeTransform } from '@angular/core';
import  _ from 'lodash';
@Pipe({ name: 'zarpoPacote' })
export class ZarpoPacotePipe implements PipeTransform {
    transform(value: any): any {
        var pacoteData = _.remove(value, function(n:any) {
            if (n.attribute === "Pacote") {
                return n;
            }
        });
        return pacoteData;

    }
}