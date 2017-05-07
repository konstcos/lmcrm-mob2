import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';

/*
 Generated class for the Statistic provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Statistic {

    constructor(public http: Http,
    public api: Api) {
        console.log('Hello Statistic Provider');
    }


    /**
     * Получение статистики с сервера
     */
    get(data: any){
        return this.api.post('api/getStatistic', data);
    }

}
