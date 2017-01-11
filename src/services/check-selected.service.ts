import { Injectable, OnInit } from '@angular/core';
@Injectable()
export class CheckSelectedService {
    constructor() {
    }
    public SelectedData: {} = {};
    setData(data: any) {
        this.SelectedData = data;
        console.log("this.SelectedData",this.SelectedData);
    };
    getData() {
        console.log("this.SelectedData",this.SelectedData);
        return Promise.resolve(this.SelectedData);
    };
}
