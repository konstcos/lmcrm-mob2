import {Component} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';

import {MainPage} from '../main/main'

/*
 Generated class for the Statistics page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-statistics',
    templateUrl: 'statistics.html'
})
export class StatisticsPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StatisticsPage');
    }

    goBack() {

        this.nav.setRoot(MainPage);
    }


}
