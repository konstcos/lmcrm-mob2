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
export class Notification {

    constructor(public http: Http,
                public api: Api) {
    }


    /**
     * Получение с сервера итемов нотификаций
     *
     */
    get(offset: number, filter: any) {
        return this.api.post('api/notification', {offset: offset, filter: filter});
    }


    /**
     * Получение типов уведомлений
     *
     */
    getNoticeTypes() {
        return this.api.post('api/notice/types', {});
    }


    /**
     * Отметить нотификацию как прочтенную
     *
     */
    mark(notice: number) {
        return this.api.post('api/notice/mark', {notice: notice});
    }

}
