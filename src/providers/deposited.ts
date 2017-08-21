import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


/*
 Generated class for the Deposited provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Deposited {


    constructor(
        public http: Http,
        public api: Api) {
    }



    /**
     * Получение с сервера итемов отданых лидов
     *
     */
    get(data: any){
        return this.api.post('api/deposited', data);
    }


    /**
     * Получение с сервера данных по одному итему отданных лидов
     *
     */
    getDepositedDetail(data: any){
        return this.api.post('api/data/deposited', data);
    }


    /**
     * Добавление лида в систему
     *
     */
    add(data: any){
        return this.api.post('api/newLead', data);
    }

}
