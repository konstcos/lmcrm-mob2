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
export class OpenLeadOrganizer {


    constructor(public http: Http,
                public api: Api) {

        console.log('Hello OpenLeadOrganizer Provider');
    }


    /**
     * Получение с сервера итемов органайзера
     */
    get(data: any) {
        return this.api.post('api/getOrganizerData', data);
    }


    /**
     * Обновление данных по органайзеру
     */
    update(data: any) {
        return this.api.post('api/updateOrganizerData', data);
    }


    /**
     * Удаление записи по органайзеру
     */
    dell(data: any) {
        return this.api.post('api/dellOrganizerItem', data);
    }


    /**
     * Смена статуса итема органайзера
     */
    apply(data: any) {
        return this.api.post('api/applyOrganizerItem', data);
    }


}
