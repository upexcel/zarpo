import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'StringToNumber' })
export class StringToNumberPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        return parseFloat(value);
    }
}