import {Component} from '@angular/core';

import {Platform, NavController, ToastController, Nav, LoadingController, ModalController} from 'ionic-angular';

// import {Push, PushObject, PushOptions} from "@ionic-native/push";

import {TranslateService} from 'ng2-translate/ng2-translate';

import {MainPage} from '../main/main';
import {SignupPage} from '../signup/signup';

import {EmailConfirmationPage} from '../email-confirmation/email-confirmation';
import {PasswordRecovery} from '../password-recovery/password-recovery';
import {RegistrationDataPage} from '../registration-data/registration-data';
import {RegistrationWaitingConfirmation} from '../registration-waiting-confirmation/registration-waiting-confirmation';
import {AdvantagesPage} from '../advantages/advantages';
import {LicensePage} from '../license/license';


import {User} from '../../providers/user';
// import {MenuPage} from "../menu/menu";

// добвление страницы управления деньгами
// import {StatisticsPage} from '../statistics/statistics'


// import {FCM} from "@ionic-native/fcm";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    // The account fields for the login form.
    // If you're using the username field with or without email, make
    // sure to add it to the type
    account: {email: string, password: string} = {
        email: '',
        password: ''
    };

    // Our translated text strings
    private loginErrorString: string;

    constructor(public navCtrl: NavController,
                public user: User,
                public toastCtrl: ToastController,
                public nav: Nav,
                public platform: Platform,
                public modalCtrl: ModalController,
                public loadingCtrl: LoadingController,
                public translate: TranslateService) {

        this.translate.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        })
    }


    /**
     * Залогинивание пользователя
     *
     */
    doLogin() {

        // показывает окно загрузки
        let loading = this.loadingCtrl.create({
            content: 'Login, please wait...'
        });
        loading.present();

        // отправка запроса на залогинивание
        this.user.login(this.account)
        // подписываемся на получение результата
            .subscribe(resp => {
                // обработка результата

                // преобразование результата в json
                let res = resp.json();

                // console.log('залогинился');
                console.log(res);

                // сценарий в зависимости от статуса ответа
                if (res.status == 'success') {
                    // успешное залогинивание

                    if (res.default_route == 'agent.lead.deposited') {

                        localStorage.setItem('default_route', 'outgoing');

                    } else {

                        localStorage.setItem('default_route', 'incoming');
                    }

                    // регистрация токена fcm
                    this.user.registerFcmToken(localStorage.getItem('fcm_token'));

                    // переход на главную страницу пользователя
                    this.nav.setRoot(MainPage);

                } else if (res.info == 'invalid_credentials') {
                    // ошибка в данных пользователя

                    let message = 'invalid login or password, please try again';

                    this.translate.get('invalid_credentials', {}).subscribe((res: string) => {
                        message = res;
                    });


                    // сообщаем об ошибках
                    let toast = this.toastCtrl.create({
                        message: message,
                        duration: 5000,
                        position: 'bottom'
                    });
                    toast.present();

                } else if (res.info == 'unfinished_registration') {

                    // регистрация токена fcm
                    this.user.registerFcmToken(localStorage.getItem('fcm_token'));

                    if (res.state == 0) {

                        this.nav.setRoot(EmailConfirmationPage);

                    } else if (res.state == 1) {

                        this.nav.setRoot(RegistrationDataPage);

                    } else if (res.state == 2) {

                        this.nav.setRoot(RegistrationWaitingConfirmation);

                    } else if (!res.license_agreement) {

                        this.nav.setRoot(LicensePage);
                    }


                    console.log(res);
                    console.log('unfinished_registration');
                    // return { status: 'error'};
                }

                loading.dismiss();

            }, (err) => {
                // this.navCtrl.push(MainPage);
                // Unable to log in
                let toast = this.toastCtrl.create({
                    message: this.loginErrorString,
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
                loading.dismiss();
            });


    }


    singUp() {
        // alert('auth');
        this.nav.setRoot(SignupPage);
    }


    /**
     * Открыть страницу описания возможностей
     *
     */
    openAdvantagesPage() {
        // this.nav.setRoot(SearchPage);
        let modal = this.modalCtrl.create(AdvantagesPage);
        modal.present();
    }


    /**
     * Переход на страницу восстановления пароля
     *
     */
    passwordRecovery() {

        // console.log('восстановление пароля');

        this.nav.setRoot(PasswordRecovery);

        // let modal = this.modalCtrl.create(PasswordRecovery);
        // modal.present();
    }


    /**
     * Инициация пушНотификаций
     *
     */
    // initPushNotification() {
    //
    //     if (!this.platform.is('cordova')) {
    //         console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
    //         return;
    //     }
    //
    //
    //     this.fcm.getToken().then(token=>{
    //         // backend.registerToken(token);
    //         // alert(token);
    //         this.user.setFcmToken(token);
    //
    //     });
    //
    //     this.fcm.onTokenRefresh().subscribe(token=>{
    //         this.user.setFcmToken(token);
    //     });
    //
    //     this.fcm.onNotification().subscribe(data=>{
    //
    //         alert(JSON.stringify(data));
    //
    //         // this.nav.setRoot(StatisticsPage);
    //
    //
    //         if(data['wasPressed']){
    //             alert("Received in background");
    //         } else {
    //             alert("Received in foreground");
    //         }
    //
    //
    //     });
    //
    // }

    // initPushNotification() {
    //     if (!this.platform.is('cordova')) {
    //         console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
    //         return;
    //     }
    //     const options: PushOptions = {
    //         android: {
    //             senderID: "861958159271"
    //         },
    //         ios: {
    //             alert: "true",
    //             badge: false,
    //             sound: "true"
    //         },
    //         windows: {}
    //     };
    //     const pushObject: PushObject = this.push.init(options);
    //
    //     pushObject.on('registration').subscribe((data: any) => {
    //         console.log("device token ->", data.registrationId);
    //
    //         alert(data.registrationId);
    //         //TODO - send device token to server
    //     });
    //
    //     pushObject.on('notification').subscribe((data: any) => {
    //         console.log('message', data.message);
    //
    //     });
    //
    //     pushObject.on('error')
    //         .subscribe(error => {
    //             console.error('Error with Push plugin', error);
    //             alert('error');
    //         });
    // }

}
