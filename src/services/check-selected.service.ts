import { Injectable, OnInit } from '@angular/core';
@Injectable()
export class CheckSelectedService {
    constructor() {
    }
    public SelectedData: {} = {};
    setData(data: any) {
        this.SelectedData = data;
    };
    getData() {
        return Promise.resolve(this.SelectedData);
    };
}
