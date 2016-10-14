import { Injectable, OnInit } from '@angular/core';
@Injectable()
export class GuestDetailService {
    constructor() {
    }
    public RegisterData: {} = {};
    setData(data: any) {
        this.RegisterData = data;
    };
    getData() {
        return Promise.resolve(this.RegisterData);
    };
}
