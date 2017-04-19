import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
 Generated class for the Salesmen page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-salesmen',
    providers: [],
    templateUrl: 'salesmen.html'
})
export class SalesmenPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SalesmenPage');
    }

}
