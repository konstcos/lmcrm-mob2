import {Component} from '@angular/core';
import {NavController, NavParams, Nav} from 'ionic-angular';
import {MenuPage} from '../menu/menu';

import {MainPage} from '../main/main'

/*
 Generated class for the Ustomers page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-customers',
    templateUrl: 'customers.html'
})
export class CustomersPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav) {
    }

    goToMainPage(){
        this.nav.setRoot(MainPage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UstomersPage');
    }

}
