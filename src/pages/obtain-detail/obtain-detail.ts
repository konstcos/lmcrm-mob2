import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/*
 Generated class for the ObtainDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-obtain-detail',
    templateUrl: 'obtain-detail.html'
})
export class ObtainDetailPage {

    item: any;

    constructor(
        public navCtrl: NavController,
        public view: ViewController,
        public params: NavParams
    ) {

        this.item = params.get('item')

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ObtainDetailPage');
    }


    cancel() {
        this.view.dismiss();
    }

}
