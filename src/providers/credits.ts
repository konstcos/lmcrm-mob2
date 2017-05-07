import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';

/*
 Generated class for the Credits provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Credits {

    constructor(public http: Http,
                public api: Api) {
        console.log('Hello Credits Provider');
    }


    /**
     * Получение кредитной истории пользователя
     *
     */
    get(data: any) {
        return this.api.post('api/getCredits', data);
    }


    /**
     * Создание запроса на ввод денег
     *
     */
    createReplenishment(data: any) {
        return this.api.post('api/createReplenishment', data);
    }


    /**
     * Оплата запроса на ввод денег
     *
     */
    payReplenishment(data: any) {
        return this.api.post('api/payReplenishment', data);
    }



}
