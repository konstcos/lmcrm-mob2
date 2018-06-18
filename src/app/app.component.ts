import {Component, ViewChild, OnInit} from '@angular/core';
import {
    Platform,
    App,
    Nav,
    Config,
    LoadingController,
    ViewController,
    ToastController,
    AlertController,
    Events,
    ModalController
} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {Settings} from '../providers/providers';

import {User} from '../providers/user';
import {CrashManager} from '../providers/crash_manager';

import {File} from '@ionic-native/file';

import {LoginPage} from '../pages/login/login';
import {MainPage} from '../pages/main/main';
import {EmailConfirmationPage} from '../pages/email-confirmation/email-confirmation';
import {RegistrationDataPage} from '../pages/registration-data/registration-data';
import {RegistrationWaitingConfirmation} from '../pages/registration-waiting-confirmation/registration-waiting-confirmation';
import {LicensePage} from '../pages/license/license';
import {CrashPage} from '../pages/crash/crash';

import {MessagesPage} from '../pages/messages/messages';


import {Push, PushObject, PushOptions} from "@ionic-native/push";
import {Badge} from '@ionic-native/badge';
// import { FCM } from '@ionic-native';


import {TranslateService} from 'ng2-translate/ng2-translate';

// import {FCM} from "@ionic-native/fcm";

@Component({
    template: `
        <ion-nav #content [root]="rootPage"></ion-nav>`,
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
                private badge: Badge,
                private crash: CrashManager,
                private modal: ModalController,
                public app: App) {

        this.events.unsubscribe("badge:set");
        this.events.subscribe("badge:set", (date) => {
            // this.noticeCount = 0;
            console.log('badge set: ');
            console.log(date);
            console.log('badge set type: ');
            console.log(typeof date);

            this.badge.set(date)
        });

        this.events.unsubscribe("notices:clear");
        this.events.subscribe("notices:clear", () => {
            this.noticeCount = 0;

            localStorage.setItem('notice', '');


            // if(this.toast){
            //     this.toast.dismiss();
            // }
        });

        // событие на открытие страницы crash
        this.events.unsubscribe("crash:page.open");
        this.events.subscribe("crash:page.open", (data) => {
            // this.noticeCount = 0;

            console.log('такие данные пришли по эвенту:');
            console.log(data);


            let crashModalPage = this.modal.create(CrashPage,
                {crashData: data.crashData},
                {showBackdrop: false, enableBackdropDismiss: false});
            crashModalPage.present();


            crashModalPage.onDidDismiss(data => {

                console.log('закрытие модального окна со страницей ошибок');

            });


            // this.nav.setRoot(LoginPage);

            // this.app.getRootNav().setRoot(LoginPage);

            // let nav = app.getActiveNav();
            // let activeView: ViewController = nav.getActive();
            // let activeView = this.nav.getActive();

            // activeView.nav.setRoot();

            // if (typeof activeView.instance.backButtonAction === 'function') {
            //
            //     activeView.instance.backButtonAction();
            // }


            // console.log('событие с главного компонента 2');

        });


        // todo Set the default language for translation strings, and the current language.
        // translate.setDefaultLang('en');
        // translate.use('en');
        translate.setDefaultLang('he');
        translate.use('he');

        settings.load();

        translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });

        localStorage.setItem('default_route', 'incoming');

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

            /**
             * Проверка пользователя на залогинивание
             *
             * залогинен или нет
             *
             */
            this.user.authCheck()
                .subscribe(resp => {

                    let res = resp.json();

                    // console.log('данные из провреки логина: ');
                    // console.log(res);

                    if (res.status == 'success') {

                        if (res.default_route == 'agent.lead.deposited') {

                            localStorage.setItem('default_route', 'outgoing');

                        } else {

                            localStorage.setItem('default_route', 'incoming');
                        }

                        // console.log(res.default_route);
                        this.nav.setRoot(MainPage);

                    } else if (res.info == 'not_logged') {
                        // пользователь не залогинен

                        // обнуляем баджики
                        this.badge.set(0);
                        // удаляем все данные
                        this.user.logout();
                        // переходим на страницу логина
                        this.nav.setRoot(LoginPage);

                    } else if (res.info == 'unfinished_registration') {
                        // не законченная регистрация у пользователя

                        // действия в зависимости от стейта
                        if (res.state == 0) {
                            // не подтвержден мэил
                            // переход на страницу мэила
                            this.nav.setRoot(EmailConfirmationPage);

                        } else if (res.state == 1) {

                            this.nav.setRoot(RegistrationDataPage);

                        } else if (res.state == 2) {

                            this.nav.setRoot(RegistrationWaitingConfirmation);

                        } else if (!res.license_agreement) {

                            this.nav.setRoot(LicensePage);
                        }

                    }

                    loading.dismiss();

                }, (err) => {
                    // непонятная ошибка

                    this.badge.set(0);

                    loading.dismiss();
                });
        });


        /**
         * Описание событие клика по аппаратной кнопке возврата
         *
         */
        platform.registerBackButtonAction(() => {
            // let nav = MyApp.getActiveNav();
            let nav = app.getActiveNav();
            let activeView: ViewController = nav.getActive();
            // let activeView = this.nav.getActive();

            if (activeView != null) {

                if (typeof activeView.instance.backButtonAction === 'function') {

                    activeView.instance.backButtonAction();
                }


                // if(nav.canGoBack()) {
                //     nav.pop();
                // }else if (typeof activeView.instance.backButtonAction === 'function')
                //     activeView.instance.backButtonAction();
                // else nav.parent.select(0); // goes to the first tab
            }
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
                senderID: "859646101662"
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

                    return false;
                }

                this.leadToast = this.toastCtrl.create({
                    // message: 'new notification ' + this.noticeCount,
                    message: 'you have new lead',
                    showCloseButton: true,
                    position: 'top'
                });

                this.leadToast.onDidDismiss(() => {
                    // console.log('Dismissed toast');
                    this.leadToast = false;
                });

                this.leadToast.present();

            } else if (data.additionalData.type == 2) {


                let text = {
                    title: 'Reminder',
                    message: 'Open Lead Reminder'
                };

                text = {
                    title: 'המארגן',
                    message: 'תזכורת לטיפול בלקוח'
                };


                // todo алерт о реминдере
                let reminder = this.alertCtrl.create({
                    title: text.title,
                    message: text.message,
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

            } else if (data.additionalData.type == 4) {

                if (this.leadToast) {

                    return false;
                }

                this.leadToast = this.toastCtrl.create({
                    message: data.additionalData.message,
                    showCloseButton: true,
                    position: 'top'
                });

                this.leadToast.onDidDismiss(() => {
                    this.leadToast = false;
                });

                this.leadToast.present();


            } else if (data.additionalData.type == 8) {

                // alert(JSON.stringify(data));

                if (this.leadToast) {

                    return false;
                }

                this.leadToast = this.toastCtrl.create({
                    // message: data.additionalData.message,
                    message: data.message,
                    showCloseButton: true,
                    position: 'bottom'
                });

                this.leadToast.onDidDismiss(() => {
                    this.leadToast = false;
                });

                this.leadToast.present();

            } else {

                if (this.atherToast) {
                    // return false;

                    return false;
                }

                this.atherToast = this.toastCtrl.create({
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
        // console.log('root');
    }


    testClick() {
        this.events.publish("child:test");
    }

}
