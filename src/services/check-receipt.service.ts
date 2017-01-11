import { Injectable, OnInit } from '@angular/core';
@Injectable()
export class CheckReceiptService {
    constructor() {
    }
    public ReceiptData: {} = {};
    setData(data: any) {
        this.ReceiptData = data;
    };
    getData() {
        return Promise.resolve(this.ReceiptData);
    };
}
