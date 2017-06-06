import {Component} from '@angular/core';
import {NavController, ToastController, Nav, LoadingController, AlertController, Events} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {MainPage} from '../main/main'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'messages',
    templateUrl: 'messages.html'
})
export class MessagesPage {

    segmentSwitch: any = 'notice';

    constructor(public navCtrl: NavController,
                public user: User,
                public nav: Nav,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public translateService: TranslateService,
                public events: Events) {

        this.events.publish("notices:clear");

    }


    /**
     * Возврат на главную страницу
     */
    goBack() {
        this.nav.setRoot(MainPage);
    }

}
