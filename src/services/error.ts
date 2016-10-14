import { Injectable } from '@angular/core';

@Injectable()
export class errorhandler {
    constructor() { }
    err(error) {
        console.log('error', error);
    }
}
