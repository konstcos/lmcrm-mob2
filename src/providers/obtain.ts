import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


/*
 Generated class for the Obtain provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Obtain {

    constructor(public http: Http, public api: Api) {

        // console.log('Hello Obtain Provider');
    }

    get(data: any){
        let seq = this.api.post('api/obtain', data).share();

        seq
            .map(res => res.json())
            .subscribe(res => {

            }, err => {
                console.error('ERROR', err);
            });

        return seq;
    }

}
