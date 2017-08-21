import {Component, ViewChild, OnInit} from '@angular/core';
import {Platform, Nav, Config, LoadingController, ToastController, AlertController, Events} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {Settings} from '../providers/providers';

import {User} from '../providers/user';

import { File } from '@ionic-native/file';

import {LoginPage} from '../pages/login/login';
import {MainPage} from '../pages/main/main';
import {EmailConfirmationPage} from '../pages/email-confirmation/email-confirmation';
import {RegistrationDataPage} from '../pages/registration-data/registration-data';
import {RegistrationWaitingConfirmation} from '../pages/registration-waiting-confirmation/registration-waiting-confirmation';

import {MessagesPage} from '../pages/messages/messages';


import {Push, PushObject, PushOptions} from "@ionic-native/push";
import {Badge} from '@ionic-native/badge';
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


    /**
     * Тост лидов
     *
     */
    leadToast: any = false;


    /**
     * Остальные тосты
     *
     */
    atherToast: any = false;

    noticeCount: number = 0;

    constructor(translate: TranslateService,
                public platform: Platform,
                public settings: Settings,
                public config: Config,
                public toastCtrl: ToastController,
                private alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public user: User,
                public events: Events,
                private push: Push,
                private file: File,
                private badge: Badge) {

        this.events.unsubscribe("badge:set");
        this.events.subscribe("badge:set", (date) => {
            // this.noticeCount = 0;
            // console.log('badge set: ');
            // console.log(date);
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

                    this.badge.set(0);

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

        // alert('проверка файлов:');
        // alert(this.file.dataDirectory);
        // alert(this.file.documentsDirectory);


        // this.file.checkDir(this.file.dataDirectory, 'mydir')
        //     .then(_ => console.log('Directory exists'))
        //     .catch(err => console.log('Directory doesnt exist'));

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

            // data.additionalData.type

            if (data.additionalData.type == 1) {

                if (this.leadToast) {
                    // return false;

                    return false;
                }

                this.leadToast = this.toastCtrl.create({
                    // message: 'new notification ' + this.noticeCount,
                    message: 'you have new lead ',
                    showCloseButton: true,
                    position: 'top'
                });

                this.leadToast.onDidDismiss(() => {
                    // console.log('Dismissed toast');
                    this.leadToast = false;
                });

                this.leadToast.present();

            }else if(data.additionalData.type == 2) {

                // todo алерт о реминдере
                let reminder = this.alertCtrl.create({
                    title: 'Reminder',
                    message: 'Open Lead Reminder',
                    buttons: [
                        // {
                        //     text: 'Reschedule',
                        //     // role: 'cancel',
                        //     handler: () => {
                        //         // console.log('Cancel clicked');
                        //         alert('Reschedule');
                        //
                        //     }
                        // },
                        {
                            text: 'Ok',
                            handler: () => {
                                // console.log('Buy clicked');
                                // alert('Apply');
                            }
                        }
                    ]
                });
                reminder.present();

            }else{

                // if (this.toast) {
                //     // return false;
                //
                //     this.toast.dismiss();
                // }
                //
                // this.toast = this.toastCtrl.create({
                //     // message: 'new notification ' + this.noticeCount,
                //     message: 'you have new notification ',
                //     showCloseButton: true,
                //     position: 'bottom'
                // });
                // this.toast.present();

                if (this.atherToast) {
                    // return false;

                    return false;
                }

                this.atherToast = this.toastCtrl.create({
                    // message: 'new notification ' + this.noticeCount,
                    message: 'you have new notification ',
                    showCloseButton: true,
                    position: 'bottom'
                });

                this.atherToast.onDidDismiss(() => {
                    // console.log('Dismissed toast');
                    this.atherToast = false;
                });

                this.atherToast.present();
            }

        });

        pushObject.on('error').subscribe(error => {
            console.error('Error with Push plugin', error);
            // alert('error');
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
