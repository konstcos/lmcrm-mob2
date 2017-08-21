import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ModalController,
    AlertController,
    ToastController,
    LoadingController,
    ActionSheetController
} from 'ionic-angular';


import {CorrespondencePage} from '../correspondence/correspondence'

import {Open} from '../../providers/open';


/*
 Generated class for the OpenLeadStatuses page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'deal-payment-manually',
    templateUrl: 'deal-payment-manually.html'
})
export class DealPaymentManuallyPage {

    public item: any;
    public statuses: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public open: Open,
                private alertCtrl: AlertController,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                public view: ViewController) {

        // получение id итема
        // this.item = this.navParams.get('item');

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Закрытие страницы
     *
     */
    close() {

        this.view.dismiss();
    }

}