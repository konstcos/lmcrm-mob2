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

    public openLeadId: any;
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

        // получение id открытого лида
        this.openLeadId = this.navParams.get('openLeadId');

        console.log(this.openLeadId);
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad OpenLeadStatusesPage');
    }


    /**
     * Алерт подтверждения платежа
     *
     */
    confirmPayment() {

        let prompt = this.alertCtrl.create({
            title: 'Payment confirmation',
            message: "You confirm that you transferred the required amount to the specified account",
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirm',
                    handler: data => {
                        // console.log('Saved clicked');
                        this.paymentDealBankTransaction();
                    }
                }
            ]
        });
        prompt.present();
    }


    /**
     * Оплата сделки через банковский перевод
     *
     */
    paymentDealBankTransaction() {

        this.open.paymentDealBankTransaction({open_lead_id: this.openLeadId})

            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {
                    // обновление данных по сделке
                    this.close('success');
                }

                // this.dealData = data.dealData;
                //
                // this.isLoading = false;
                // this.isContent = true;

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Закрытие страницы
     *
     */
    close(status = 'no_status') {

        this.view.dismiss({status: status});
    }

}