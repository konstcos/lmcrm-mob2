import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {MainPage} from '../main/main'
import {User} from '../../providers/user';
import {Notification} from '../../providers/notification';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'messages-filter',
    templateUrl: 'messages-filter.html'
})
export class MessagesFilterPage {


    constructor(public viewCtrl: ViewController) {

        // this.events.publish("notices:clear");

        console.log('запустился поповер');

    }


    /**
     * Закрытие поповера
     *
     */
    close() {
        this.viewCtrl.dismiss();
    }

}