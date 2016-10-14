import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'rooms' })
export class RoomsPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        let roomArray: any = [];
        var room = value;

        for (let key in room) {
            var room_info = value[key];

            roomArray.push(room_info);
        }
        return roomArray;
    }
}