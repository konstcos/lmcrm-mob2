import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {Settings} from '../../providers/settings';

/*
 Generated class for the Deposited page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-deposited',
    templateUrl: 'deposited.html'
})
export class DepositedPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public settings: Settings) {

    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad DepositedPage');
    }

    ionViewWillEnter() {
        console.log('DepositedPage View');
        console.log( this.settings.settings )
    }


}
