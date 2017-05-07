import {Component} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';

// главная страница
import {MainPage} from '../main/main'


/*
 Generated class for the Credits page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-credits',
    templateUrl: 'credits.html'
})
export class CreditsPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CreditsPage');
    }

    /**
     * Возврат назад
     *
     */
    goBack() {

        this.nav.setRoot(MainPage);
    }
}
