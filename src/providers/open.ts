import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


/*
 Generated class for the Open provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Open {

    constructor(
        public http: Http,
        public api: Api) {
    }


    /**
     * Получение с сервера итемов обтэин
     */
    get(data: any){
        return this.api.post('api/opened', data);
    }


    /**
     * Получение с сервера итемов обтэин
     */
    changeStatus(data: any){
        return this.api.post('api/changeOpenLeadStatus', data);
    }

}
