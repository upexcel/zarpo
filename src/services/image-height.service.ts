import { Injectable, OnInit } from '@angular/core';
//import {Storage, LocalStorage} from 'ionic-angular';

@Injectable()
export class ImageHeightService {
    constructor() {
    }
    getImageHeight() {
        var x = window.innerWidth * 34.8 / 100;
        var roundHeight = Math.ceil(x);
        return Promise.resolve(roundHeight);
    }
}
