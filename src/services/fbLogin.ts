import { Injectable } from '@angular/core';
import {Facebook} from 'ionic-native';
import {Platform} from 'ionic-angular';


@Injectable()
export class facebookLogin {

    constructor() { }
    fbLogin() {
        return Facebook.login(["public_profile", "email", "user_friends"]).then((result) => {
            if (result.status == "connected") {
                return this.fbApi(result.authResponse);
            } else {
                return "user not login";
            }
        },
            (error) => {
                return error;
            });
    }

    fbApi(authResponse: any) {
        return Facebook.api('/me?fields=email,first_name,last_name,gender&access_token=' + authResponse.accessToken, null).then((response) => {
            return response;
        },
            (error) => {
                return error;
            })
    }
}