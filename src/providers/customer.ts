import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';

/*
 Generated class for the Customer provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Customer {

    constructor(public http: Http,
                public api: Api) {

        // console.log('Hello Customer Provider');

        console.log('custumer');

    }


    /**
     * Получение с сервера всех сфер агента с сводными данными по всем маскам
     */
    getSpheres(data: any) {
        return this.api.post('api/agentSphereMasks', data);
    }


    /**
     * Получение всех масок по одной сфере
     */
    getSphereMasks(sphereId: number, salesmenId: any) {
        return this.api.post('api/agentSphereMasksData', {sphereId: sphereId, salesmenId: salesmenId});
    }


    /**
     * Переключение активности масок
     *
     */
    switchMaskActive(maskId: number) {
        return this.api.post('api/maskActiveSwitch', {maskId: maskId});
    }


    /**
     * Получение данных для редактирования маски
     *
     */
    editMask(maskId: number) {
        return this.api.post('api/sphereMasksEdit', {maskId: maskId});
    }


    /**
     * Сохранение данных по маске
     *
     */
    saveMask(mask: any, newMask: boolean, salesmenId: any) {

        // todo переделать на один роут

        if (newMask) {

            console.log(salesmenId);

            return this.api.post('api/saveNewMask', {mask: mask, salesmenId: salesmenId});

        } else {

            return this.api.post('api/saveMask', {mask: mask, salesmenId: salesmenId});
        }

    }


    /**
     * Удаление маски
     *
     */
    deleteMask(maskId: number, salesmenId: any) {
        return this.api.post('api/dellMask', {maskId: maskId, salesmenId: salesmenId});
    }

}
