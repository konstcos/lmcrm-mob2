import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams, Headers} from '@angular/http';
// import { Storage } from '@ionic/storage';

import {Settings} from './settings'

import {User} from './user'

import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
    // url: string = 'http://lmcrm.cos';
    // url: string = 'http://lmcrm.biz.tm';
    // url: string = 'http://demo.contact.org.il';
    // todo вернуть
    url: string = 'https://backoffice.contact.org.il';


    user: any = User;

    /**
     * Включить/выключить ведение логов
     *
     */
    log: boolean = false;


    /**
     * Включить/выключить дебаг
     *
     */
    debug: boolean = true;

    constructor(
        public http: Http,
        // public storage: Storage,
        public settings: Settings) {


        // this.settings.load();

        // this.storage.ready().then(() => {
        //     console.log('из api:');
        //     console.log( this.settings.settings );
        //     console.log('END из api');
        // });


    }



    get(endpoint: string, params?: any, options?: RequestOptions) {
        if (!options) {
            options = new RequestOptions();
        }

        // Support easy query params for GET requests
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
            }
            // Set the search field if we have params and don't already have
            // a search field set in options.
            options.search = !options.search && p || options.search;
        }

        return this.http.get(this.url + '/' + endpoint, options);
    }

    // post(endpoint: string, body: any, options?: RequestOptions) {
    //     return this.http.post(this.url + '/' + endpoint, body, options);
    // }



    post(endpoint: string, body: any) {


        let headers = new Headers();


        if( localStorage.getItem('token') && localStorage.getItem('token') != '' ){

            // options = 'Authorization: Bearer' + localStorage.getItem('token');
            headers.append('Authorization', 'Bearer' + localStorage.getItem('token'));
        }

        return this.http.post(this.url + '/' + endpoint, body, {headers: headers});
    }


    put(endpoint: string, body: any, options?: RequestOptions) {
        return this.http.put(this.url + '/' + endpoint, body, options);
    }

    delete(endpoint: string, body: any, options?: RequestOptions) {
        return this.http.post(this.url + '/' + endpoint, body, options);
    }

    patch(endpoint: string, body: any, options?: RequestOptions) {
        return this.http.put(this.url + '/' + endpoint, body, options);
    }
}
