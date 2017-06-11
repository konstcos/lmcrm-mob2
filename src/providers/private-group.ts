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
export class PrivateGroup {

    constructor(public http: Http,
                public api: Api) {
    }


    /**
     * Получение с сервера итемов обтэин
     *
     */
    members() {
        return this.api.post('api/private/group/members', {});
    }


    /**
     * Поиск участников
     *
     */
    searchMember(keyword: string) {
        return this.api.post('api/private/search/member', {keyword: keyword});
    }


    /**
     * Добавление участников
     *
     */
    addMember(agentId: number, revenueShare: number) {
        return this.api.post('api/private/add/member', {agentId: agentId, revenueShare: revenueShare});
    }


    /**
     * Удаление участника из группы
     *
     */
    removeMember(memberId: number) {
        return this.api.post('api/private/remove/member', {memberId: memberId});
    }


    /**
     * Получение с сервера итемов обтэин
     */
    changeStatus(data: any) {
        return this.api.post('api/changeOpenLeadStatus', data);
    }

}
