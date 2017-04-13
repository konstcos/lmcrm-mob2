import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
 Generated class for the AddLead page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-add-lead',
    templateUrl: 'add-lead.html'
})
export class AddLeadPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad AddLeadPage');
    }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {

    }


    /**
     * Закрытие окна
     *
     */
    goBackPop() {

        this.navCtrl.pop();

    }

}
