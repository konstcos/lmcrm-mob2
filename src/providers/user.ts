import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';

import {Settings} from './settings';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {LoginPage} from '../pages/login/login'
// import {Nav} from "ionic-angular";


/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
    _user: any;
    token: String = '';

    constructor(
        public http: Http,
        public api: Api,
        public s: Settings
    ) {
    }

// , public nav: Nav

    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    login(accountInfo: any) {

        // console.log('settings START');
        // console.log( this.s.settings );
        // console.log('settings END');

        let seq = this.api.post('api/login', accountInfo).share();

        // var response;

        // console.log('settings');
        // console.log( this.s.load().then() );

        // this.s.load().then( data => {
        //         console.log(data)
        //     }
        // );

        // console.log(seq);

        seq
            .map(res => res.json())
            .subscribe(res => {

                // console.log('user');
                // console.log(res);

                // If the API returned a successful response, mark the user as logged in
                // if (res.status == 'success') {
                //     this._loggedIn(res);
                // } else {
                // }

                if (res.status == 'Ok') {
                    this._loggedIn(res);
                    // return { status: 'success'};

                } else if(res == 'invalid_credentials') {

                    // return { status: 'invalid', detail: 'invalid_credentials' };

                } else {

                    // return { status: 'error'};
                }


            }, err => {
                console.error('ERROR', err);
            });

        return seq;
    }

    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    signup(accountInfo: any) {
        let seq = this.api.post('signup', accountInfo).share();

        // console.log('user');
        // console.log(seq);

        seq
            .map(res => res.json())
            .subscribe(res => {
                // If the API returned a successful response, mark the user as logged in

                alert(res);
                // console.log(res);
                // if (res.status == 'success') {
                //     this._loggedIn(res);
                // }

                if (res.status == 'Ok') {
                    this._loggedIn(res);
                }


            }, err => {
                console.error('ERROR', err);
                // alert('ERROR: ' + err);

            });

        return seq;
    }

    /**
     * Log the user out, which forgets the session
     */
    logout() {
        this._user = null;
        this.token = null;
        localStorage.setItem('token', '')
    }

    /**
     * Process a login/signup response to store user data
     */
    _loggedIn(resp) {
        this._user = resp.roles;
        this.token = resp.token;
        localStorage.setItem('token', resp.token)

    }
}
