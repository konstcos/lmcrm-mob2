import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/*
 Generated class for the OpenDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-detail',
    templateUrl: 'open-detail.html'
})
export class OpenDetailPage {

    item: any;

    constructor(public navCtrl: NavController,
                public view: ViewController,
                public navParams: NavParams) {

        this.item = navParams.get('item')
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenDetailPage');
    }


    close() {
        this.view.dismiss();
    }

}
