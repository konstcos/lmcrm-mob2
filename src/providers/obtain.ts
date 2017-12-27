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

    constructor(
        public http: Http,
        public api: Api) {
    }


    /**
     * Получение с сервера итемов обтэин
     */
    get(data: any){
        return this.api.post('api/obtain', data).share();
    }

    /**
     * Получение подробностей по итему аукциона
     */
    getItemDetail(auctionId: number){
        return this.api.post('api/obtain/detail', {auctionId: auctionId}).share();
    }

    /**
     * Получение с сервера итемов обтэин
     */
    openLead(data: any){
        return this.api.post('api/openLead', data);
    }


    /**
     * Получение с сервера итемов обтэин
     */
    markSeenAuction(data: any){
        return this.api.post('api/mark/seen/obtain', data);
    }
}
