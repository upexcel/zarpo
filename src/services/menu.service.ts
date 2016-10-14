import { Injectable, OnInit} from '@angular/core';
//import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import  _ from 'lodash'
import {config} from '../config'
import {Md5} from 'ts-md5/dist/md5';
import {LocalStorageService} from './local-storage.service';

@Injectable()
export class menuService implements OnInit {

    ngOnInit() {

    }
    loadTags(dataload) {

        var result = [];
        //load pension tags
        _.each(dataload, function(value, key) {
            _.each(value, function(value1, key1) {
                var obj = {
                    location: '',
                    hotels: [],
                    image: '',
                    sub: {}
                };
                var hotelId = [];
                _.each(value1.hotel_ids, function(value2, id) {
                    hotelId.push(id);
                });
                var subresult = [];
                _.each(value1.subtags, function(value3, key3) {

                    _.each(value3, function(value4, key4) {
                        var su = {
                            location: key4,
                            hotels:[]
                        }
                        let hotelId=[]
                        _.each(value4.hotel_ids, function(value5, id5) {
                            hotelId.push(id5);
                        });
                        su.hotels=hotelId;
                        subresult.push(su);
                    });
                });

                obj.location = key1;
                obj.hotels = hotelId;
                obj.image = value1.image;
                obj.sub = subresult
                result.push(obj);

            });

        });

        return result;
    }


}