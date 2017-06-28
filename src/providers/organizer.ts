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
export class Organizer {


    constructor(public http: Http,
                public api: Api) {

        console.log('Hello OpenLeadOrganizer Provider');
    }


    // todo удалить
    test() {
        console.log('organizer provider');
    }

    /**
     * Получение с сервера итемов органайзера
     */
    get(offset: number, filter: any) {
        return this.api.post('api/getAgentOrganizerData', {offset: offset, filter: filter});
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
