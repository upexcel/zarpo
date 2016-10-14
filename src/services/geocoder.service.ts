import { Injectable, OnInit} from '@angular/core';
//import {Storage} from '@ionic-angular';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GeocoderService implements OnInit {
    ngOnInit() {
    }
    constructor(private http: Http) {
    }
    fetchPoints(address: string): Observable<{}> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        var key = 'AIzaSyA94HTT_HUIQZjKN2ZOFmHVCWblejrQUfc';
        var api_path = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + key;
        let url = api_path;
        return this.http.get(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status + res.url);
        }
        return body || {};
    }
    private handleError(error: any) {
        console.log(error);
        let errMsg = error.message || 'Server error';
        return Observable.throw(errMsg);

    }

}