import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';

/*
 Generated class for the OpenLeadOrganizer provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class menuManager {


    constructor(public http: Http,
                public api: Api) {

        console.log('Hello menuManager Provider');
    }


    // todo удалить
    test() {
        console.log('menuManager provider');
    }


}