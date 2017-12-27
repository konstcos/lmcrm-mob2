import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';

// import { FCM } from 'ionic-native';

import {Settings} from './settings';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

// import {LoginPage} from '../pages/login/login'
// import {Nav} from "ionic-angular";


/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
    _user: any;
    token: String = '';

    constructor(public http: Http,
                public api: Api,
                public s: Settings) {
    }


    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    login(accountInfo: any) {

        let seq = this.api.post('api/login', accountInfo).share();

        seq
            .map(res => res.json())
            .subscribe(res => {

                // console.log('user');
                // console.log(res);

                // If the API returned a successful response, mark the user as logged in
                // if (res.status == 'success') {
                //     this._loggedIn(res);
                // } else {
                // }

                if (res.status == 'success') {
                    this._loggedIn(res);
                    // return { status: 'success'};

                } else if (res.info == 'invalid_credentials') {

                    // return { status: 'invalid', detail: 'invalid_credentials' };

                } else if (res.info == 'unfinished_registration') {
                    this._loggedIn(res);

                } else {

                    // return { status: 'error'};
                }


            }, err => {
                console.error('ERROR', err);
            });

        return seq;
    }


    /**
     * Send a POST request to our signup endpoint with the data
     * the user entered on the form.
     */
    registrationStepOne(accountInfo: any) {

        let seq = this.api.post('api/registrationStepOne', accountInfo);

        // console.log('user');
        // console.log(seq);

        // seq
        //     .map(res => res.json())
        //     .subscribe(res => {
        //         // If the API returned a successful response, mark the user as logged in
        //
        //         // alert(res);
        //         // console.log(res);
        //         if (res.status == 'success') {
        //             this._loggedIn(res);
        //         }
        //
        //         // if (res.status == 'Ok') {
        //         //     this._loggedIn(res);
        //         // }
        //
        //
        //     }, err => {
        //         console.error('ERROR', err);
        //         // alert('ERROR: ' + err);
        //
        //     });

        return seq;
    }


    /**
     * Log the user out, which forgets the session
     */
    logout() {
        this._user = null;
        this.token = null;

        let fcm_token = localStorage.getItem('fcm_token');

        let seq = this.api.post('api/logout', {fcm_token: fcm_token}).share();

        seq
            .map(res => res.json())
            .subscribe(res => {

                // console.log('user');
                console.log(res);

            }, err => {
                console.error('ERROR', err);
            });


        localStorage.setItem('token', '');

        return seq;
    }


    /**
     * Получение всех сфер пользователя
     *
     */
    getSpheres() {

        let seq = this.api.post('api/getSpheres', {}).share();

        return seq;
    }


    /**
     * Получение всех специализаций пользователя
     *
     */
    getSpecializations(role) {

        let seq = this.api.post('api/specializations/get', {role: role}).share();

        return seq;
    }


    /**
     * Сообщение об отсутствующих специализациях
     *
     */
    notSpecializationMake(name: String, phone: any = false) {

        let seq = this.api.post('api/specializations/absence', {name: name, phone: phone}).share();

        return seq;
    }


    /**
     * Получение регионов пользователя
     *
     */
    getRegions(regionId: number) {

        let seq = this.api.post('api/getRegions', {regionId: regionId}).share();

        return seq;
    }


    /**
     * Получение всех сфер пользователя
     *
     */
    getSphereStatuses(sphereId: number) {

        let seq = this.api.post('api/getSphereStatuses', {sphereId: sphereId}).share();

        return seq;
    }


    /**
     * Получение описание роли
     *
     */
    getRoleDescription(roleId: number, lang: string) {

        let seq = this.api.post('api/getRoleDescription', {roleId: roleId, lang: lang}).share();

        return seq;
    }


    /**
     * Получение всех сфер пользователя
     *
     */
    getGroupMembers() {

        // console.log('getGroup');

        let seq = this.api.post('api/getGroupMembers', {}).share();

        return seq;
    }


    /**
     * Сохранение токена
     *
     */
    registerFcmToken(token: string) {

        let seq = this.api.post('api/registerFcmToken', {token: token})
            .subscribe(resp => {

                let res = resp.json();

                console.log(res);

            }, (err) => {
                // this.navCtrl.push(MainPage);
                // Unable to log in
                // let toast = this.toastCtrl.create({
                //     message: this.loginErrorString,
                //     duration: 3000,
                //     position: 'top'
                // });
            });

        return seq;
    }


    /**
     * Проверка авторизации
     *
     */
    authCheck() {

        let fcm_token = localStorage.getItem('fcm_token');

        return this.api.post('api/authCheck', {fcm_token: fcm_token}).share();
    }


    /**
     * Получение всех сфер пользователя
     *
     */
    getAllSystemSpheres() {

        return this.api.post('api/getAllSpheres', {}).share();
    }


    /**
     * Активация нового пользователя (подтверждение мэила)
     *
     */
    activate(code: String) {

        return this.api.post('api/activate', {code: code});
    }


    /**
     * Повторная отправка кода активации
     *
     */
    resendActivationCode() {

        return this.api.post('api/resend/activation/code', {});
    }


    /**
     * Сохранение необходимых данных агента
     *
     */
    saveAgentData(data: any) {

        return this.api.post('api/saveAgentData', data);
    }


    /**
     * Проверка подтверждения учетной записи агента акк. менеджером
     *
     */
    confirmationCheck() {

        return this.api.post('api/confirmationCheck', {});
    }


    /**
     * Получение лицензии агента для подтверждения
     *
     */
    getAgentLicense() {
        return this.api.post('api/license/get', {});
    }


    /**
     * Подтверждение соглашения агентом
     *
     */
    agreeAgentLicense() {
        return this.api.post('api/license/agree', {});
    }


    /**
     * Получение данных агента по кредитам
     *
     */
    getAgentCreditsData() {
        return this.api.post('api/agent/credit/data', {});
    }


    /**
     * Получение профиля пользователя
     *
     */
    getAgentProfile() {

        return this.api.post('api/profile/get', {});
    }


    /**
     * Получение данных по поддержке пользователя
     *
     */
    getSupport() {
        return this.api.post('api/support/get', {});
    }


    /**
     * Сохранение профиля пользователя
     *
     */
    saveAgentProfile(data: any) {

        return this.api.post('api/profile/save', data);
    }


    /**
     * Получение данных по кошельку агента
     *
     */
    getWalletData() {

        return this.api.post('api/get/wallet/data', {});
    }


    /**
     * Process a login/signup response to store user data
     */
    _loggedIn(resp) {
        this._user = resp.roles;
        this.token = resp.token;

        // console.log(resp);

        localStorage.setItem('token', resp.token)
    }
}
