import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, Config} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {Settings} from '../providers/providers';

import {User} from '../providers/user';

import {LoginPage} from '../pages/login/login';

// import {Push, PushObject, PushOptions} from "@ionic-native/push";

// import { FCM } from '@ionic-native';


import {TranslateService} from 'ng2-translate/ng2-translate';
import {FCM} from "@ionic-native/fcm";

@Component({
    template: `<ion-nav #content [root]="rootPage" ></ion-nav>`
})
export class MyApp {

    rootPage = LoginPage;
    @ViewChild(Nav) nav: Nav;


    constructor(translate: TranslateService,
                public platform: Platform,
                settings: Settings,
                config: Config,
                public fcm: FCM,
                public user: User) {
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


            this.initPushNotification();
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
        this.fcm.getToken().then(token => {
            // backend.registerToken(token);
            // alert(token);
            // todo сохранить токен в локалСторедже
            this.user.setFcmToken(token);

        });

        /**
         * Обновление fcm токена
         *
         */
        this.fcm.onTokenRefresh().subscribe(token => {

            // todo проверка залогинен/незалогинен - если залогинен - обновить токен
            this.user.setFcmToken(token);
        });

        /**
         * При получении нотификации
         *
         */
        this.fcm.onNotification().subscribe(data => {

            alert(JSON.stringify(data));

            // this.nav.setRoot(StatisticsPage);


            if (data['wasPressed']) {
                alert("Received in background");
            } else {
                alert("Received in foreground");
            }


        });

    }


}
