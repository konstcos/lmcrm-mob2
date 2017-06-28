import {Component, ViewChild, OnInit} from '@angular/core';
import {Platform, Nav, Config, LoadingController, ToastController, Events} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {Settings} from '../providers/providers';

import {User} from '../providers/user';

import {LoginPage} from '../pages/login/login';
import {MainPage} from '../pages/main/main';
import {EmailConfirmationPage} from '../pages/email-confirmation/email-confirmation';
import {RegistrationDataPage} from '../pages/registration-data/registration-data';
import {RegistrationWaitingConfirmation} from '../pages/registration-waiting-confirmation/registration-waiting-confirmation';

import {MessagesPage} from '../pages/messages/messages';


import {Push, PushObject, PushOptions} from "@ionic-native/push";
import { Badge } from '@ionic-native/badge';
// import { FCM } from '@ionic-native';


import {TranslateService} from 'ng2-translate/ng2-translate';
// import {FCM} from "@ionic-native/fcm";

@Component({
    template: `<ion-nav #content [root]="rootPage" ></ion-nav>`,
    // providers: [Content]
})
export class MyApp {

    rootPage = LoginPage;
    @ViewChild(Nav) nav: Nav;
    // @ViewChild(Content) content: Content;
    // @ViewChild(MainPage) MainPage: MainPage;


    toast: any = false;

    noticeCount: number = 0;

    constructor(translate: TranslateService,
                public platform: Platform,
                settings: Settings,
                config: Config,
                public toastCtrl: ToastController,
                // public fcm: FCM,
                public loadingCtrl: LoadingController,
                public user: User,
                public events: Events,
                private push: Push,
                private badge: Badge) {


        this.events.subscribe("badge:set", (date) => {
            // this.noticeCount = 0;
            badge.set(date)
        });


        this.events.subscribe("notices:clear", () => {
            this.noticeCount = 0;

            localStorage.setItem('notice', '');


            // if(this.toast){
            //     this.toast.dismiss();
            // }
        });

        // Set the default language for translation strings, and the current language.
        translate.setDefaultLang('en');
        translate.use('en');

        settings.load();

        translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();

            // Splashscreen.hide();

            // инициация пушНотификация
            this.initPushNotification();

            // todo проверка авторизации
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });

            loading.present();

            this.user.authCheck()
                .subscribe(resp => {

                    let res = resp.json();

                    console.log(res);

                    if (res.status == 'success') {

                        this.nav.setRoot(MainPage);

                    } else if (res.info == 'unfinished_registration') {


                        if (res.state == 0) {

                            this.nav.setRoot(EmailConfirmationPage);

                        } else if (res.state == 1) {

                            this.nav.setRoot(RegistrationDataPage);

                        } else if (res.state == 2) {

                            this.nav.setRoot(RegistrationWaitingConfirmation);
                        }

                        console.log(res);
                        console.log('unfinished_registration');
                        // return { status: 'error'};
                    }

                    loading.dismiss();

                }, (err) => {

                    console.log(err);

                    loading.dismiss();

                    // this.navCtrl.push(MainPage);
                    // Unable to log in
                    // let toast = this.toastCtrl.create({
                    //     message: this.loginErrorString,
                    //     duration: 3000,
                    //     position: 'top'
                    // });
                });
        });

    }


    /**
     * Инициация пушНотификаций
     *
     */
    initPushNotification() {

        if (!this.platform.is('cordova')) {
            console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
            return;
        }

        /**
         * Получение fcm токена
         *
         */
        // this.fcm.getToken().then(token => {
        //
        //     // получение fcm токена,
        //     // на сервере сохранится только при успешном логине пользователя
        //     localStorage.setItem('fcm_token', token);
        // });

        /**
         * Обновление fcm токена
         *
         */
        // this.fcm.onTokenRefresh().subscribe(token => {
        //
        //     // проверка логина
        //     if( localStorage.getItem('token') && localStorage.getItem('token') != '' ){
        //         // если токен существует и он не пустой
        //
        //         this.user.registerFcmToken(token);
        //
        //     }else{
        //         // todo убиваем fcm токен
        //
        //     }
        //
        //     // todo проверка залогинен/незалогинен - если залогинен - обновить токен
        // });

        /**
         * При получении нотификации
         *
         */
        // this.fcm.onNotification().subscribe(data => {
        //
        //     // alert(JSON.stringify(data));
        //
        //     // this.nav.setRoot(StatisticsPage);
        //
        //     // let toast = this.toastCtrl.create({
        //     //     message: 'new notification',
        //     //     showCloseButton: true,
        //     //     position: 'bottom'
        //     // });
        //     // toast.present();
        //
        //
        //
        //     this.noticeCount = this.noticeCount + 1;
        //
        //
        //     this.events.publish("child:test", this.noticeCount);
        //
        //
        //     if(this.toast){
        //         this.toast.dismiss();
        //     }
        //
        //     this.toast = this.toastCtrl.create({
        //         message: 'new notification ' + this.noticeCount,
        //         showCloseButton: true,
        //         position: 'bottom'
        //     });
        //     this.toast.present();
        //
        //
        //     // this.MainPage.setNewNotices();
        //
        //     // if (data['wasPressed']) {
        //     //     alert("Received in background");
        //     // } else {
        //     //     alert("Received in foreground");
        //     // }
        //
        //
        // });


        /**
         * Данные по инициации нотификации
         *
         */
        const options: PushOptions = {
            android: {
                senderID: "861958159271"
            },
            ios: {
                alert: "true",
                badge: false,
                sound: "true"
            },
            windows: {}
        };


        /**
         * Инициация пушНотификаций
         *
         */
        const pushObject: PushObject = this.push.init(options);


        /**
         * Получение fcm токена
         *
         */
        pushObject.on('registration').subscribe((data: any) => {
            // console.log("device token ->", data.registrationId);

            // alert(data.registrationId);
            //TODO - send device token to server

            // получение fcm токена,
            // на сервере сохранится только при успешном логине пользователя
            localStorage.setItem('fcm_token', data.registrationId);

        });


        /**
         * При получении нотификации
         *
         */
        pushObject.on('notification').subscribe((data: any) => {
            // console.log('message', data.message);

            // alert(JSON.stringify(data));

            // this.nav.setRoot(StatisticsPage);

            // let toast = this.toastCtrl.create({
            //     message: 'new notification',
            //     showCloseButton: true,
            //     position: 'bottom'
            // });
            // toast.present();


            // this.noticeCount = this.noticeCount + 1;

            // localStorage.setItem('notice', String(this.noticeCount));


            // this.events.publish("child:test", this.noticeCount);

            // this.content.resize();


            // alert(this.noticeCount);


            if (this.toast) {
                // return false;

                this.toast.dismiss();
            }

            this.toast = this.toastCtrl.create({
                // message: 'new notification ' + this.noticeCount,
                message: 'you have new notification ',
                showCloseButton: true,
                position: 'bottom'
            });
            this.toast.present();


        });

        pushObject.on('error').subscribe(error => {
            console.error('Error with Push plugin', error);
            alert('error');
        });
    }


    ngAfterViewInit() {
        // After the view is initialized, this.userProfile will be available
        // this.update();
        this.events.publish("child:test");
        console.log('root');
    }


    alert() {
        alert('ok worck');
    }

    testClick() {
        this.events.publish("child:test");
    }

}
