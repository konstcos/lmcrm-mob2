import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/*
 Generated class for the DepositedDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-deposited-detail',
    templateUrl: 'deposited-detail.html'
})
export class DepositedDetailPage {


    item: any;

    constructor(public navCtrl: NavController,
                public view: ViewController,
                public navParams: NavParams) {

        this.item = navParams.get('item')

        console.log(this.item);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DepositedDetailPage');
    }


    close() {
        this.view.dismiss();
    }

}
